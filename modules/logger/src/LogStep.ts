import { performance } from 'node:perf_hooks';
import type { Writable } from 'node:stream';
import pc from 'picocolors';
import { LogBuffer } from './LogBuffer';

type StepOptions = {
	verbosity: number;
	onEnd: (step: LogStep) => Promise<void>;
	onMessage: (type: 'error' | 'warn' | 'info' | 'log' | 'debug') => void;
	stream?: Writable;
	description?: string;
	writePrefixes?: boolean;
};

const prefix = {
	FAIL: pc.red('✘'),
	SUCCESS: pc.green('✔'),
	TIMER: pc.red('⏳'),
	START: pc.dim(pc.bold('▶︎')),
	END: pc.dim(pc.bold('■')),
	ERR: pc.red(pc.bold('ERR')),
	WARN: pc.yellow(pc.bold('WRN')),
	LOG: pc.cyan(pc.bold('LOG')),
	DBG: pc.magenta(pc.bold('DBG')),
	INFO: pc.blue(pc.bold('INFO')),
};

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
	#buffer: LogBuffer;
	#stream: Writable;
	#active = false;
	#onEnd: StepOptions['onEnd'];
	#onMessage: StepOptions['onMessage'];
	#lastThree: Array<string> = [];
	#writing: boolean = false;
	#writePrefixes: boolean = true;

	/**
	 * Whether or not an error has been sent to the step. This is not necessarily indicative of uncaught thrown errors, but solely on whether `.error()` has been called in this step.
	 */
	hasError = false;
	/**
	 * Whether or not a warning has been sent to this step.
	 */
	hasWarning = false;
	/**
	 * Whether or not an info message has been sent to this step.
	 */
	hasInfo = false;
	/**
	 * Whether or not a log message has been sent to this step.
	 */
	hasLog = false;

	/**
	 * @internal
	 */
	constructor(name: string, { onEnd, onMessage, verbosity, stream, description, writePrefixes }: StepOptions) {
		performance.mark(`onerepo_start_${name || 'logger'}`, {
			detail: description,
		});
		this.#verbosity = verbosity;
		this.#name = name;
		this.#onEnd = onEnd;
		this.#onMessage = onMessage;
		this.#buffer = new LogBuffer({});
		this.#stream = stream ?? process.stderr;
		this.#writePrefixes = writePrefixes ?? true;
		if (this.name) {
			if (process.env.GITHUB_RUN_ID) {
				this.#writeStream(`::group::${this.name}\n`);
			}
			this.#writeStream(this.#prefixStart(this.name));
		}
	}

	/**
	 * @internal
	 */
	get writable() {
		return this.#stream.writable && this.#buffer.writable;
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
	activate(enableWrite = !('isTTY' in this.#stream && this.#stream.isTTY)) {
		if (this.#active && this.#writing === enableWrite) {
			return;
		}

		this.#active = true;

		if (enableWrite) {
			this.#enableWrite();
		}
	}

	/**
	 * @internal
	 */
	deactivate() {
		if (!this.#active) {
			return;
		}

		this.#active = false;
		if (this.#writing) {
			this.#buffer.off('data', noop);
			this.#buffer.off('data', this.#write);
			this.#writing = false;
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
		this.#buffer.on('data', this.#write);
		this.#writing = true;
	}

	#write = (chunk: unknown) => this.#stream.write(chunk);

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
		this.#writeStream(ensureNewline(this.#prefixEnd(`${this.hasError ? prefix.FAIL : prefix.SUCCESS} ${text}`)));
		if (this.name && process.env.GITHUB_RUN_ID) {
			this.#writeStream('::endgroup::\n');
		}

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
		if (!this.#buffer.writable) {
			return;
		}

		// End the buffer, helps with memory/gc
		// But do it after immediate otherwise the buffer may not be done flushing to stream
		return await new Promise<void>((resolve) => {
			setImmediate(() => {
				this.#buffer.end(() => {
					resolve();
				});
			});
		});
	}

	/**
	 * Log an informative message. Should be used when trying to convey information with a user that is important enough to always be returned.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	info(contents: unknown) {
		this.#onMessage('info');
		this.hasInfo = true;
		if (this.verbosity >= 1) {
			this.#writeStream(this.#prefix(prefix.INFO, stringify(contents)));
		}
	}

	/**
	 * Log an error. This will cause the root logger to include an error and fail a command.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	error(contents: unknown) {
		this.#onMessage('error');
		this.hasError = true;
		if (this.verbosity >= 1) {
			this.#writeStream(this.#prefix(prefix.ERR, stringify(contents)));
		}
	}

	/**
	 * Log a warning. Does not have any effect on the command run, but will be called out.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	warn(contents: unknown) {
		this.#onMessage('warn');
		this.hasWarning = true;
		if (this.verbosity >= 2) {
			this.#writeStream(this.#prefix(prefix.WARN, stringify(contents)));
		}
	}

	/**
	 * General logging information. Useful for light informative debugging. Recommended to use sparingly.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	log(contents: unknown) {
		this.#onMessage('log');
		this.hasLog = true;
		if (this.verbosity >= 3) {
			this.#writeStream(this.#prefix(this.name ? prefix.LOG : '', stringify(contents)));
		}
	}

	/**
	 * Extra debug logging when verbosity greater than or equal to 4.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	debug(contents: unknown) {
		this.#onMessage('debug');
		if (this.verbosity >= 4) {
			this.#writeStream(this.#prefix(prefix.DBG, stringify(contents)));
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
				this.#prefix(prefix.TIMER, `${start} → ${end}: ${Math.round(endMark.startTime - startMark.startTime)}ms`),
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
		return ` ${this.name ? '┌' : prefix.START} ${output}`;
	}

	#prefix(prefix: string, output: string) {
		return output
			.split('\n')
			.map((line) => ` ${this.name ? '│' : ''}${this.#writePrefixes ? ` ${prefix} ` : ''}${line}`)
			.join('\n');
	}

	#prefixEnd(output: string) {
		return ` ${this.name ? '└' : prefix.END} ${output}`;
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
