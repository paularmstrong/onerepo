import { performance } from 'node:perf_hooks';
import type { Writable } from 'node:stream';
import { Duplex } from 'node:stream';
import pc from 'picocolors';

type StepOptions = {
	verbosity: number;
	onEnd: (step: LogStep) => Promise<void>;
	onError: () => void;
	stream?: Writable;
	description?: string;
};

const MARK_FAIL = pc.red('✘');
const MARK_SUCCESS = pc.green('✔');
const MARK_TIMER = pc.red('⏳');

const PREFIX_START = pc.dim(pc.bold('▶︎'));
const PREFIX_ERR = pc.red(pc.bold('ERR'));
const PREFIX_WARN = pc.yellow(pc.bold('WRN'));
const PREFIX_LOG = pc.cyan(pc.bold('LOG'));
const PREFIX_DBG = pc.magenta(pc.bold('DBG'));
const PREFIX_SUCC = pc.green(pc.bold('SUCC'));
const PREFIX_END = pc.dim(pc.bold('■'));

const noop = () => {};

/**
 * Log steps should only be created via the {@link Logger#createStep | `logger.createStep()`} method.
 *
 * ```ts
 * const step = logger.createStep('Do some work');
 * // ... long task with a bunch of potential output
 * await step.end();
 * ```
 *
 * @group Logger
 */
export class LogStep {
	#name: string;
	#verbosity: number;
	#buffer: Duplex;
	#stream: Writable;
	#active = false;
	#onEnd: (step: LogStep) => Promise<void>;
	#onError: () => void;
	#lastThree: Array<string> = [];
	#writing: boolean = false;

	/**
	 * Whether or not this step has logged an error.
	 *
	 * @internal
	 */
	hasError = false;

	/**
	 * @internal
	 */
	constructor(name: string, { onEnd, onError, verbosity, stream, description }: StepOptions) {
		performance.mark(`onerepo_start_${name || 'logger'}`, {
			detail: description,
		});
		this.#verbosity = verbosity;
		this.#name = name;
		this.#onEnd = onEnd;
		this.#onError = onError;
		this.#buffer = new LogData({});
		this.#stream = stream ?? process.stderr;
		if (this.name) {
			this.#writeStream(this.#prefixStart(this.name));
		}
	}

	/**
	 * @internal
	 */
	get name() {
		return this.#name;
	}

	/**
	 * @internal
	 */
	get active() {
		return this.#active;
	}

	/**
	 * While buffering logs, returns the status line and last 3 lines of buffered output.
	 *
	 * @internal
	 */
	get status(): Array<string> {
		return [this.#prefixStart(this.name), ...this.#lastThree];
	}

	/**
	 * @internal
	 */
	set verbosity(verbosity: number) {
		this.#verbosity = verbosity;
	}

	/**
	 * @internal
	 */
	get verbosity() {
		return this.#verbosity;
	}

	/**
	 * Activate a step. This is typically only called from within the root `Logger` instance and should not be done manually.
	 *
	 * @internal
	 */
	activate(enableWrite = this.#stream === process.stderr && !process.stderr.isTTY) {
		if (this.#active) {
			return;
		}

		this.#active = true;
		if (enableWrite) {
			this.#enableWrite();
		}
	}

	#enableWrite() {
		if (this.#writing) {
			return;
		}

		if (this.verbosity <= 0) {
			// no-op to get into "flowing mode"
			this.#buffer.on('data', noop);
			this.#writing = false;
			return;
		}

		this.#buffer.off('data', noop);
		// Ideally we'd use `this.#buffer.pipe(this.#stream)`, but that seems to not always pipe??
		this.#buffer.on('data', (chunk) => this.#stream.write(chunk));
		this.#writing = true;
	}

	/**
	 * Finish this step and flush all buffered logs. Once a step is ended, it will no longer accept any logging output and will be effectively removed from the base logger. Consider this method similar to a destructor or teardown.
	 *
	 * ```ts
	 * await step.end();
	 * ```
	 */
	async end() {
		const endMark = performance.mark(`onerepo_end_${this.name || 'logger'}`);
		const [startMark] = performance.getEntriesByName(`onerepo_start_${this.name || 'logger'}`);

		// TODO: jest.useFakeTimers does not seem to be applying to performance correctly
		const duration =
			!startMark || process.env.NODE_ENV === 'test' ? 0 : Math.round(endMark.startTime - startMark.startTime);
		const text = this.name
			? pc.dim(`${duration}ms`)
			: `Completed${this.hasError ? ' with errors' : ''} ${pc.dim(`${duration}ms`)}`;
		this.#writeStream(ensureNewline(this.#prefixEnd(`${this.hasError ? MARK_FAIL : MARK_SUCCESS} ${text}`)));

		return this.#onEnd(this);
	}

	/**
	 * @internal
	 */
	async flush(): Promise<void> {
		this.#active = true;
		this.#enableWrite();

		// if no name, this is the root logger step
		// if not writable, then we can't actually flush/end anything
		if (!this.name || !this.#buffer.writable) {
			return;
		}

		// End the buffer, helps with memory/gc
		// But do it after immediate otherwise the buffer may not be done flushing to stream
		return await new Promise<void>((resolve) => {
			this.#buffer.end(() => {
				resolve();
			});
		});
	}

	/**
	 * Log a success message.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	success(contents: unknown) {
		this.#writeStream(this.#prefix(PREFIX_SUCC, stringify(contents)));
	}

	/**
	 * Log an error. This will cause the root logger to include an error and fail a command.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	error(contents: unknown) {
		this.hasError = true;
		this.#onError();
		if (this.verbosity >= 1) {
			this.#writeStream(this.#prefix(PREFIX_ERR, stringify(contents)));
		}
	}

	/**
	 * Log a warning. Does not have any effect on the command run, but will be called out.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	warn(contents: unknown) {
		if (this.verbosity >= 2) {
			this.#writeStream(this.#prefix(PREFIX_WARN, stringify(contents)));
		}
	}

	/**
	 * Log general information.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	log(contents: unknown) {
		if (this.verbosity >= 3) {
			this.#writeStream(this.#prefix(this.name ? PREFIX_LOG : '', stringify(contents)));
		}
	}

	/**
	 * Extra debug logging when verbosity greater than or equal to 4.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	debug(contents: unknown) {
		if (this.verbosity >= 4) {
			this.#writeStream(this.#prefix(PREFIX_DBG, stringify(contents)));
		}
	}

	/**
	 * Log timing information between two [Node.js performance mark names](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#performancemarkname-options).
	 *
	 * @group Logging
	 * @param start A `PerformanceMark` entry name
	 * @param end A `PerformanceMark` entry name
	 */
	timing(start: string, end: string) {
		if (this.verbosity >= 5) {
			const [startMark] = performance.getEntriesByName(start);
			const [endMark] = performance.getEntriesByName(end);
			if (!startMark || !endMark) {
				this.warn(`Unable to log timing. Missing either mark ${start} → ${end}`);
				return;
			}
			this.#writeStream(
				this.#prefix(MARK_TIMER, `${start} → ${end}: ${Math.round(endMark.startTime - startMark.startTime)}ms`),
			);
		}
	}

	#writeStream(line: string) {
		this.#buffer.write(ensureNewline(line));
		if (this.#active) {
			const lines = line.split('\n');
			const lastThree = lines.slice(-3);
			this.#lastThree.push(...lastThree.map(pc.dim));
			this.#lastThree.splice(0, this.#lastThree.length - 3);
		}
	}

	#prefixStart(output: string) {
		return ` ${this.name ? '┌' : PREFIX_START} ${output}`;
	}

	#prefix(prefix: string, output: string) {
		return output
			.split('\n')
			.map((line) => ` ${this.name ? '│ ' : ''}${prefix} ${line}`)
			.join('\n');
	}

	#prefixEnd(output: string) {
		return ` ${this.name ? '└' : PREFIX_END} ${output}`;
	}
}

class LogData extends Duplex {
	_read() {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_write(chunk: string, encoding = 'utf8', callback: () => void) {
		this.push(chunk);
		callback();
	}

	_final(callback: () => void) {
		this.push(null);
		callback();
	}
}

function stringify(item: unknown): string {
	if (typeof item === 'string') {
		return item.replace(/^\n+/, '').replace(/\n*$/g, '');
	}

	if (
		Array.isArray(item) ||
		(typeof item === 'object' && item !== null && item.constructor === Object) ||
		item === null
	) {
		return JSON.stringify(item, null, 2);
	}

	if (item instanceof Date) {
		return item.toISOString();
	}

	return `${String(item)}`;
}

function ensureNewline(str: string): string {
	if (/^\S*$/.test(str)) {
		return '';
	}
	return str.endsWith('\n') ? str : str.replace(/\n*$/g, '\n');
}
