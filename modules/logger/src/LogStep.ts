import { performance } from 'node:perf_hooks';
import pc from 'picocolors';
import { Duplex } from 'node:stream';

type StepOptions = {
	verbosity: number;
	onEnd: (step: LogStep) => Promise<void>;
	onError: () => void;
	stream?: Duplex;
};

/**
 * Log steps should only be created via the {@link Logger#createStep} method.
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
	#stream: Duplex;
	#active = false;
	#onEnd: (step: LogStep) => Promise<void>;
	#onError: () => void;
	#lastThree: Array<string> = [];

	/**
	 * Whether or not this step has logged an error.
	 *
	 * @internal
	 */
	hasError = false;

	/**
	 * @internal
	 */
	constructor(name: string, { onEnd, onError, verbosity, stream }: StepOptions) {
		performance.mark(`start_${name || 'logger'}`);
		this.#verbosity = verbosity;
		this.#name = name;
		this.#onEnd = onEnd;
		this.#onError = onError;
		this.#stream = stream ?? new LogData();
		if (this.name) {
			this.#writeStream(this.#prefixStart(this.name));
		} else {
			this.#enableWrite();
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
		this.activate();
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
	activate(enableWrite = !process.stderr.isTTY) {
		if (this.#active) {
			return;
		}

		this.#active = true;
		if (enableWrite && this.verbosity > 0) {
			this.#enableWrite();
		}
	}

	#enableWrite() {
		if (process.env.NODE_ENV === 'test') {
			// Do not write logs in test – ever.
			return;
		}
		this.#stream.on('data', (chunk) => {
			// All log output goes to stderr. No exceptions.
			// This allows commands to write to stdout and not mix log information with true output.
			// However, if you plan on writing to a file, consider actually writing to a file with the fs api.
			process.stderr.write(chunk.toString());
		});
	}

	/**
	 * Finish this step and flush all buffered logs. Once a step is ended, it will no longer accept any logging output and will be effectively removed from the base logger. Consider this method similar to a destructor or teardown.
	 *
	 * ```ts
	 * await step.end();
	 * ```
	 */
	async end() {
		const endMark = `end_${this.name || 'logger'}`;
		performance.mark(endMark);

		// TODO: jest.useFakeTimers does not seem to be applying to performance correctly
		const duration =
			process.env.NODE_ENV === 'test'
				? 0
				: Math.round(performance.measure(this.name || 'logger', `start_${this.name || 'logger'}`, endMark).duration);
		const text = this.name
			? pc.dim(`${duration}ms`)
			: `Completed${this.hasError ? ' with errors' : ''} ${pc.dim(`${duration}ms`)}`;
		this.#writeStream(ensureNewline(this.#prefixEnd(`${this.hasError ? pc.red('✘ ') : pc.green('✔ ')}${text}`)));

		return this.#onEnd(this);
	}

	/**
	 * @internal
	 */
	async flush(): Promise<void> {
		this.#active = true;
		if (process.stderr.isTTY) {
			this.#enableWrite();
		}

		return new Promise((resolve) => {
			if (this.name && this.#stream.writable) {
				this.#stream.end('');
			}

			resolve();
		});
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
			const prefix = pc.red(pc.bold('ERR'));
			this.#writeStream(this.#prefix(prefix, stringify(contents)));
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
			const prefix = pc.yellow(pc.bold('WRN'));
			this.#writeStream(this.#prefix(prefix, stringify(contents)));
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
			const prefix = pc.cyan(pc.bold('LOG'));
			this.#writeStream(this.#prefix(this.name ? prefix : '', stringify(contents)));
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
			const prefix = pc.magenta(pc.bold('DBG'));
			this.#writeStream(this.#prefix(prefix, stringify(contents)));
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
			this.#writeStream(
				this.#prefix(
					pc.red('⏳'),
					`${start} → ${end}: ${Math.round(performance.measure(`${start} to ${end}`, start, end).duration)}ms`
				)
			);
		}
	}

	#writeStream(line: string) {
		this.#stream.write(ensureNewline(line));
		if (this.#active) {
			this.#lastThree.push(...pc.dim(line).split('\n'));
			this.#lastThree.splice(0, this.#lastThree.length - 3);
		}
	}

	#prefixStart(output: string) {
		return output
			.split('\n')
			.map((line) => ` ${this.name ? '┌ ' : pc.dim(pc.bold('▶︎ '))}${line}`)
			.join('\n');
	}

	#prefix(prefix: string, output: string) {
		return output
			.split('\n')
			.map((line) => ` ${this.name ? '│ ' : ''}${prefix} ${line}`)
			.join('\n');
	}

	#prefixEnd(output: string) {
		return output
			.split('\n')
			.map((line) => ` ${this.name ? '└ ' : pc.dim(pc.bold('■ '))}${line}`)
			.join('\n');
	}
}

class LogData extends Duplex {
	_read() {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_write(chunk: string, encoding = 'utf8', callback: () => void) {
		this.push(chunk);
		callback();
	}

	_final() {
		this.push(null);
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
