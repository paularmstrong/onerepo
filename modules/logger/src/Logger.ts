import type { Writable } from 'node:stream';
import { destroyCurrent, setCurrent } from './global';
import { LogStep } from './LogStep';
import { LogStepToString } from './transforms/LogStepToString';
import { LogProgress } from './transforms/LogProgress';
import { hideCursor, showCursor } from './utils/cursor';
import type { Verbosity } from './types';

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
	 * Applies the new verbosity to the main logger and any future steps.
	 */
	set verbosity(value: Verbosity) {
		this.#verbosity = Math.max(0, value) as Verbosity;

		if (this.#defaultLogger) {
			this.#defaultLogger.verbosity = this.#verbosity;
			// this.#activate(this.#defaultLogger);
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
		return this.#defaultLogger.hasError;
	}

	/**
	 * Whether or not a warning has been sent to the logger or any of its steps.
	 */
	get hasWarning() {
		return this.#defaultLogger.hasWarning;
	}

	/**
	 * Whether or not an info message has been sent to the logger or any of its steps.
	 */
	get hasInfo() {
		return this.#defaultLogger.hasInfo;
	}

	/**
	 * Whether or not a log message has been sent to the logger or any of its steps.
	 */
	get hasLog() {
		return this.#defaultLogger.hasLog;
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
	 * Unpause the logger and uncork writing buffered logs to the output stream. See {@link Logger#pause | `logger.pause()`} for more information.
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
		opts: {
			/**
			 * Optionally include extra information for performance tracing on this step. This description will be passed through to the [`performanceMark.detail`](https://nodejs.org/docs/latest-v20.x/api/perf_hooks.html#performancemarkdetail) recorded internally for this step.
			 *
			 * Use a [Performance Writer plugin](https://onerepo.tools/plugins/performance-writer/) to read and work with this detail.
			 */
			description?: string;
			/**
			 * Override the default logger verbosity. Any changes while this step is running to the default logger will result in this step’s verbosity changing as well.
			 */
			verbosity?: Verbosity;
			/**
			 * @deprecated This option no longer does anything and will be removed in v2.0.0
			 */
			writePrefixes?: boolean;
		} = {},
	) {
		const step = new LogStep({ name, verbosity: opts.verbosity ?? this.#verbosity, description: opts.description });
		this.#steps.push(step);
		step.on('end', () => this.#onEnd(step));

		this.#activate(step);
		return step;
	}

	/**
	 * Write directly to the Logger's output stream, bypassing any formatting and verbosity filtering.
	 *
	 * :::caution[Advanced]
	 * Since {@link LogStep} implements a [Node.js duplex stream](https://nodejs.org/docs/latest-v20.x/api/stream.html#class-streamduplex), it is possible to use internal `write`, `read`, `pipe`, and all other available methods, but may not be fully recommended.
	 * :::
	 *
	 * @group Logging
	 * @see {@link LogStep.write | `LogStep.write`}.
	 */
	write(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		chunk: any,
		encoding?: BufferEncoding,
		cb?: (error: Error | null | undefined) => void,
	): boolean;

	/**
	 * @internal
	 */
	write(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		chunk: any,
		cb?: (error: Error | null | undefined) => void,
	): boolean;

	write(
		// @ts-expect-error
		...args
	) {
		// @ts-expect-error
		return super.write(...args);
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
	 * logger.info(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`. If a function is given with no arguments, the function will be executed and its response will be stringified for output.
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
	 * logger.error(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`. If a function is given with no arguments, the function will be executed and its response will be stringified for output.
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
	 * logger.warn(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`. If a function is given with no arguments, the function will be executed and its response will be stringified for output.
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
	 * logger.log(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`. If a function is given with no arguments, the function will be executed and its response will be stringified for output.
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
	 * logger.debug(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
	 * ```
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`. If a function is given with no arguments, the function will be executed and its response will be stringified for output.
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

	async waitForClear() {
		return await new Promise<boolean>((resolve) => {
			setImmediate(() => {
				resolve(this.#steps.length === 0);
			});
		});
	}

	/**
	 * @internal
	 */
	async end() {
		this.unpause();

		const now = Date.now();
		while ((await this.waitForClear()) === false) {
			if (Date.now() - now > 100) {
				const openStep = this.#steps[0];
				if (openStep) {
					openStep.error(
						'Did not complete before command shutdown. Fix this issue by updating this command to call `step.end();` at the appropriate time.',
					);
					openStep.end();
				}
			}
			continue;
		}

		this.#activate(this.#defaultLogger);
		this.#defaultLogger.uncork();
		await new Promise<void>((resolve) => {
			this.#defaultLogger.end(() => {
				resolve();
			});
		});

		this.#defaultLogger.unpipe();

		destroyCurrent();
		showCursor();
	}

	#activate(step: LogStep) {
		const activeStep = this.#steps.find((step) => step.isPiped);

		if (activeStep) {
			return;
		}

		if (step !== this.#defaultLogger && !this.#defaultLogger.isPaused()) {
			this.#defaultLogger.cork();
		}

		if (step.isPiped) {
			return;
		}

		hideCursor();

		if (!step.name || !(this.#stream as typeof process.stderr).isTTY) {
			step.pipe(new LogStepToString()).pipe(this.#stream as Writable);
		} else {
			step
				.pipe(new LogStepToString())
				.pipe(new LogProgress())
				.pipe(this.#stream as Writable);
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

		this.#defaultLogger.uncork();

		if (step.hasError && process.env.GITHUB_RUN_ID) {
			this.error('The previous step has errors.');
		}

		// Remove this step
		this.#steps.splice(index, 1);

		if (this.#steps.length < 1) {
			return;
		}

		await new Promise<void>((resolve) => {
			setImmediate(() => {
				setImmediate(() => {
					this.#defaultLogger.cork();
					resolve();
				});
			});
		});

		this.#activate(this.#steps[0]);
	};

	#setState = (step: LogStep) => {
		this.#defaultLogger.hasError = step.hasError || this.#defaultLogger.hasError;
		this.#defaultLogger.hasWarning = step.hasWarning || this.#defaultLogger.hasWarning;
		this.#defaultLogger.hasInfo = step.hasInfo || this.#defaultLogger.hasInfo;
		this.#defaultLogger.hasLog = step.hasLog || this.#defaultLogger.hasLog;
	};
}
