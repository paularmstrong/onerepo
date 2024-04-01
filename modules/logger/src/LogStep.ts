import { performance } from 'node:perf_hooks';
import type { Writable } from 'node:stream';
import pc from 'picocolors';
import type { LineType } from './LogBuffer';
import { LogBuffer } from './LogBuffer';

type StepOptions = {
	verbosity: number;
	onEnd: (step: LogStep) => Promise<void>;
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
	#lastThree: Array<{ type: LineType; line: string }> = [];
	#writing: boolean = false;
	#writePrefixes: boolean = true;
	#startMark: string;

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
	constructor(name: string, { onEnd, verbosity, stream, description, writePrefixes }: StepOptions) {
		this.#startMark = name || `${performance.now()}`;
		performance.mark(`onerepo_start_${this.#startMark}`, {
			detail: description,
		});
		this.#verbosity = verbosity;
		this.#name = name;
		this.#onEnd = onEnd;
		this.#buffer = new LogBuffer({ name });
		this.#stream = stream ?? process.stderr;
		this.#writePrefixes = writePrefixes ?? true;

		if (this.name) {
			// if (process.env.GITHUB_RUN_ID) {
			// 	this.#writeStream(`::group::${this.name}\n`);
			// }
			this.#writeStream('start', this.name);
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
	get status(): Array<{ type: LineType; line: string }> {
		return this.#lastThree;
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
			this.#buffer.cork();
			this.#writing = false;
		}
	}

	#enableWrite() {
		if (this.#writing) {
			return;
		}

		if (this.verbosity <= 0) {
			this.#writing = false;
			return;
		}

		if (this.#buffer.writableCorked) {
			this.#buffer.uncork();
			this.#writing = true;
			return;
		}

		this.#buffer.pipe(this.#stream);
		this.#buffer.read();
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
		const endMark = performance.mark(`onerepo_end_${this.#startMark}`);
		const [startMark] = performance.getEntriesByName(`onerepo_start_${this.#startMark}`);

		// TODO: jest.useFakeTimers does not seem to be applying to performance correctly
		const duration =
			!startMark || process.env.NODE_ENV === 'test' ? 0 : Math.round(endMark.startTime - startMark.startTime);
		const text = this.name
			? pc.dim(`${duration}ms`)
			: `Completed${this.hasError ? ' with errors' : ''} ${pc.dim(`${duration}ms`)}`;
		this.#writeStream('end', ensureNewline(`${this.hasError ? prefix.FAIL : prefix.SUCCESS} ${text}`));
		// if (this.name && process.env.GITHUB_RUN_ID) {
		// 	this.#writeStream('::endgroup::\n');
		// }

		return this.#onEnd(this);
	}

	/**
	 * @internal
	 */
	async flush(): Promise<void> {
		this.#active = true;
		this.#enableWrite();

		// if not writable, then we can't actually flush/end anything
		if (!this.#buffer.writable) {
			return;
		}

		await new Promise<void>((resolve) => {
			setImmediate(() => {
				resolve();
			});
		});

		// Unpipe the buffer, helps with memory/gc
		// But do it after a tick (above) otherwise the buffer may not be done flushing to stream
		this.#buffer.unpipe();
	}

	/**
	 * Log an informative message. Should be used when trying to convey information with a user that is important enough to always be returned.
	 *
	 * ```ts
	 * step.info('Log this content when verbosity is >= 1');
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:
	 *
	 * ```ts
	 * step.info(() => bigArray.map((item) => item.name));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	info(contents: unknown) {
		// this.#onMessage('info');
		this.hasInfo = true;
		this.#writeStream('info', stringify(contents), this.verbosity >= 1);
	}

	/**
	 * Log an error. This will cause the root logger to include an error and fail a command.
	 *
	 * ```ts
	 * step.error('Log this content when verbosity is >= 1');
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged error:
	 *
	 * ```ts
	 * step.error(() => bigArray.map((item) => item.name));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	error(contents: unknown) {
		// this.#onMessage('error');
		this.hasError = true;
		this.#writeStream('error', stringify(contents), this.verbosity >= 1);
	}

	/**
	 * Log a warning. Does not have any effect on the command run, but will be called out.
	 *
	 * ```ts
	 * step.warn('Log this content when verbosity is >= 2');
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged warning:
	 *
	 * ```ts
	 * step.warn(() => bigArray.map((item) => item.name));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	warn(contents: unknown) {
		// this.#onMessage('warn');
		this.hasWarning = true;
		this.#writeStream('warn', stringify(contents), this.verbosity >= 2);
	}

	/**
	 * General logging information. Useful for light informative debugging. Recommended to use sparingly.
	 *
	 * ```ts
	 * step.log('Log this content when verbosity is >= 3');
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:
	 *
	 * ```ts
	 * step.log(() => bigArray.map((item) => item.name));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	log(contents: unknown) {
		// this.#onMessage('log');
		this.hasLog = true;
		this.#writeStream('log', stringify(contents), this.verbosity >= 3);
	}

	/**
	 * Extra debug logging when verbosity greater than or equal to 4.
	 *
	 * ```ts
	 * step.debug('Log this content when verbosity is >= 4');
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged debug information:
	 *
	 * ```ts
	 * step.debug(() => bigArray.map((item) => item.name));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	debug(contents: unknown) {
		// this.#onMessage('debug');
		this.#writeStream('debug', stringify(contents), this.verbosity >= 4);
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
			this.#writeStream('timing', `${start} → ${end}: ${Math.round(endMark.startTime - startMark.startTime)}ms`);
		}
	}

	#writeStream(type: LineType, line: string, toBuffer: boolean = true) {
		if (toBuffer) {
			this.#buffer.write(ensureNewline(line));
		}

		if (this.#active) {
			// const lines = line.split('\n');
			// const lastThree = lines.slice(-3);
			this.#lastThree.push({ type, line });
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

	if (typeof item === 'function' && item.length === 0) {
		return stringify(item());
	}

	return `${String(item)}`;
}

function ensureNewline(str: string): string {
	if (/^\S*$/.test(str)) {
		return '';
	}
	return str.endsWith('\n') ? str : str.replace(/\n*$/g, '\n');
}
