import type { Writable } from 'node:stream';
import { destroyCurrent, setCurrent } from './global';
import { LogStep } from './LogStep';
import { LogStepToString } from './transforms/LogStepToString';
import { LogProgress } from './transforms/LogProgress';
import { hideCursor, showCursor } from './utils/cursor';
import type { Verbosity } from './types';

// EventEmitter.defaultMaxListeners = cpus().length + 2;

/**
 * @group Logger
 */
export type LoggerOptions = {
	/**
	 * Control how much and what kind of output the Logger will provide.
	 */
	verbosity: Verbosity;
	/**
	 * Advanced – override the writable stream in order to pipe logs elsewhere. Mostly used for dependency injection for `@onerepo/test-cli`.
	 */
	stream?: Writable | LogStep;
	/**
	 * @experimental
	 */
	captureAll?: boolean;
};

/**
 * The oneRepo logger helps build commands and capture output from spawned subprocess in a way that's both delightful to the end user and includes easy to scan and follow output.
 *
 * All output will be redirected from `stdout` to `stderr` to ensure order of output and prevent confusion of what output can be piped and written to files.
 *
 * If the current terminal is a TTY, output will be buffered and asynchronous steps will animated with a progress logger.
 *
 * See {@link !HandlerExtra | `HandlerExtra`} for access the the global Logger instance.
 *
 * @group Logger
 */
export class Logger {
	#defaultLogger: LogStep;
	#steps: Array<LogStep> = [];
	#verbosity: Verbosity = 0;
	#stream: Writable | LogStep;

	#hasError = false;
	#hasWarning = false;
	#hasInfo = false;
	#hasLog = false;

	#captureAll = false;

	/**
	 * @internal
	 */
	constructor(options: LoggerOptions) {
		this.#defaultLogger = new LogStep({ name: '', verbosity: options.verbosity });
		this.#stream = options.stream ?? process.stderr;
		this.#captureAll = !!options.captureAll;
		this.verbosity = options.verbosity;

		setCurrent(this);
	}

	/**
	 * @experimental
	 */
	get captureAll() {
		return this.#captureAll;
	}

	/**
	 * Get the logger's verbosity level
	 */
	get verbosity(): Verbosity {
		return this.#verbosity;
	}

	/**
	 * Recursively applies the new verbosity to the logger and all of its active steps.
	 */
	set verbosity(value: Verbosity) {
		this.#verbosity = Math.max(0, value) as Verbosity;

		if (this.#defaultLogger) {
			this.#defaultLogger.verbosity = this.#verbosity;
			this.#activate(this.#defaultLogger);
		}

		this.#steps.forEach((step) => (step.verbosity = this.#verbosity));
	}

	get writable() {
		return this.#defaultLogger.writable;
	}

	/**
	 * Whether or not an error has been sent to the logger or any of its steps. This is not necessarily indicative of uncaught thrown errors, but solely on whether `.error()` has been called in the `Logger` or any `Step` instance.
	 */
	get hasError() {
		return this.#hasError;
	}

	/**
	 * Whether or not a warning has been sent to the logger or any of its steps.
	 */
	get hasWarning() {
		return this.#hasWarning;
	}

	/**
	 * Whether or not an info message has been sent to the logger or any of its steps.
	 */
	get hasInfo() {
		return this.#hasInfo;
	}

	/**
	 * Whether or not a log message has been sent to the logger or any of its steps.
	 */
	get hasLog() {
		return this.#hasLog;
	}

	/**
	 * @internal
	 */
	set stream(stream: Writable | LogStep) {
		this.#stream = stream;
	}

	/**
	 * @internal
	 */
	get stream() {
		return this.#stream;
	}

	/**
	 * When the terminal is a TTY, steps are automatically animated with a progress indicator. There are times when it's necessary to stop this animation, like when needing to capture user input from `stdin`. Call the `pause()` method before requesting input and {@link Logger#unpause | `logger.unpause()`} when complete.
	 *
	 * This process is also automated by the {@link !run | `run()`} function when `stdio` is set to `pipe`.
	 *
	 * ```ts
	 * logger.pause();
	 * // capture input
	 * logger.unpause();
	 * ```
	 */
	pause() {
		this.#stream.cork();
		showCursor();
	}

	/**
	 * Unpause the logger and resume writing buffered logs to the output stream. See {@link Logger#pause | `logger.pause()`} for more information.
	 */
	unpause() {
		this.#stream.uncork();
		hideCursor();
	}

	/**
	 * Create a sub-step, {@link LogStep | `LogStep`}, for the logger. This and any other step will be tracked and required to finish before exit.
	 *
	 * ```ts
	 * const step = logger.createStep('Do fun stuff');
	 * // do some work
	 * await step.end();
	 * ```
	 *
	 * @param name The name to be written and wrapped around any output logged to this new step.
	 */
	createStep(
		name: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		opts: {
			// @deprecated This option no longer does anything
			writePrefixes?: boolean;
		} = {},
	) {
		const step = new LogStep({ name, verbosity: this.#verbosity });
		this.#steps.push(step);
		step.on('end', () => this.#onEnd(step));

		this.#activate(step);
		return step;
	}

	/**
	 * Should be used to convey information or instructions through the log, will log when verbositu >= 1
	 *
	 * ```ts
	 * logger.info('Log this content when verbosity is >= 1');
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:
	 *
	 * ```ts
	 * logger.info(() => bigArray.map((item) => item.name));
	 * ```
	 *
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 * @see {@link LogStep#info | `info()`} This is a pass-through for the main step’s {@link LogStep#info | `info()`} method.
	 */
	info(contents: unknown) {
		this.#hasInfo = true;
		this.#defaultLogger.info(contents);
	}

	/**
	 * Log an error. This will cause the root logger to include an error and fail a command.
	 *
	 * ```ts
	 * logger.error('Log this content when verbosity is >= 1');
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged error:
	 *
	 * ```ts
	 * logger.error(() => bigArray.map((item) => item.name));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 * @see {@link LogStep#error | `error()`} This is a pass-through for the main step’s {@link LogStep#error | `error()`} method.
	 */
	error(contents: unknown) {
		this.#hasError = true;
		this.#defaultLogger.error(contents);
	}

	/**
	 * Log a warning. Does not have any effect on the command run, but will be called out.
	 *
	 * ```ts
	 * logger.warn('Log this content when verbosity is >= 2');
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged warning:
	 *
	 * ```ts
	 * logger.warn(() => bigArray.map((item) => item.name));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 * @see {@link LogStep#warn | `warn()`} This is a pass-through for the main step’s {@link LogStep#warn | `warn()`} method.
	 */
	warn(contents: unknown) {
		this.#hasWarning = true;
		this.#defaultLogger.warn(contents);
	}

	/**
	 * General logging information. Useful for light informative debugging. Recommended to use sparingly.
	 *
	 * ```ts
	 * logger.log('Log this content when verbosity is >= 3');
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:
	 *
	 * ```ts
	 * logger.log(() => bigArray.map((item) => item.name));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 * @see {@link LogStep#log | `log()`} This is a pass-through for the main step’s {@link LogStep#log | `log()`} method.
	 */
	log(contents: unknown) {
		this.#hasLog = true;
		this.#defaultLogger.log(contents);
	}

	/**
	 * Extra debug logging when verbosity greater than or equal to 4.
	 *
	 * ```ts
	 * logger.debug('Log this content when verbosity is >= 4');
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged debug information:
	 *
	 * ```ts
	 * logger.debug(() => bigArray.map((item) => item.name));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 * @see {@link LogStep#debug | `debug()`} This is a pass-through for the main step’s {@link LogStep#debug | `debug()`} method.
	 */
	debug(contents: unknown) {
		this.#defaultLogger.debug(contents);
	}

	/**
	 * Log timing information between two [Node.js performance mark names](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#performancemarkname-options).
	 *
	 * @group Logging
	 * @param start A `PerformanceMark` entry name
	 * @param end A `PerformanceMark` entry name
	 * @see {@link LogStep#timing | `timing()`} This is a pass-through for the main step’s {@link LogStep#timing | `timing()`} method.
	 */
	timing(start: string, end: string) {
		this.#defaultLogger.timing(start, end);
	}

	/**
	 * @internal
	 */
	async end() {
		this.unpause();

		await new Promise<void>((resolve) => {
			setImmediate(() => {
				setImmediate(() => {
					resolve();
				});
			});
		});

		for (const step of this.#steps) {
			this.#defaultLogger.warn(
				`Step "${step.name}" did not finish before command shutdown. Fix this issue by updating this command to call \`step.end();\` at the appropriate time.`,
			);
			await this.#onEnd(step);
		}

		await new Promise<void>((resolve) => {
			setImmediate(() => {
				setImmediate(() => {
					resolve();
				});
			});
		});

		this.#defaultLogger.end();

		await new Promise<void>((resolve) => {
			setImmediate(() => {
				setImmediate(() => {
					resolve();
				});
			});
		});

		destroyCurrent();
		showCursor();
	}

	#activate(step: LogStep) {
		const activeStep = this.#steps.find((step) => step.isPiped);

		if (activeStep) {
			return;
		}

		if (step !== this.#defaultLogger && !this.#defaultLogger.isPaused()) {
			this.#defaultLogger.pause();
		}

		if (step.isPiped) {
			return;
			// step.unpipe();
		}

		// this.unpause();

		if (!step.name || !(this.#stream as typeof process.stderr).isTTY) {
			step.pipe(new LogStepToString()).pipe(this.#stream);
		} else {
			step.pipe(new LogStepToString()).pipe(new LogProgress()).pipe(this.#stream);
		}
		step.isPiped = true;
	}

	#onEnd = async (step: LogStep) => {
		if (step === this.#defaultLogger || !step.isPiped) {
			return;
		}

		const index = this.#steps.findIndex((s) => s === step);
		if (index < 0) {
			return;
		}

		this.#setState(step);

		step.unpipe();
		step.destroy();
		step.isPiped = false;
		// step.destroy();
		// await step.flush();

		this.#defaultLogger.resume();

		// if (step.hasError && process.env.GITHUB_RUN_ID) {
		// 	this.error('The previous step has errors.');
		// }

		// Remove this step
		this.#steps.splice(index, 1);

		if (this.#steps.length < 1) {
			return;
		}

		await new Promise<void>((resolve) => {
			setImmediate(() => {
				setImmediate(() => {
					this.#defaultLogger.pause();
					resolve();
				});
			});
		});

		this.#activate(this.#steps[0]);
	};

	#setState = (step: LogStep) => {
		this.#hasError = this.#hasError || step.hasError;
		this.#hasWarning = this.#hasWarning || step.hasWarning;
		this.#hasInfo = this.#hasInfo || step.hasInfo;
		this.#hasLog = this.#hasLog || step.hasLog;
	};
}
