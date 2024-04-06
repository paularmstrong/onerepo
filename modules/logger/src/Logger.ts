import type { Writable } from 'node:stream';
import { cpus } from 'node:os';
import { EventEmitter } from 'node:events';
import { createLogUpdate } from 'log-update';
import type logUpdate from 'log-update';
// import { LogStep } from './LogStep';
import { destroyCurrent, setCurrent } from './global';
import { LogStep, LogBufferToString } from './LogBuffer';

type LogUpdate = typeof logUpdate;

EventEmitter.defaultMaxListeners = cpus().length + 2;

/**
 * Control the verbosity of the log output
 *
 * | Value  | What           | Description                                      |
 * | ------ | -------------- | ------------------------------------------------ |
 * | `<= 0` | Silent         | No output will be read or written.               |
 * | `>= 1` | Error, Info    |                                                  |
 * | `>= 2` | Warnings       |                                                  |
 * | `>= 3` | Log            |                                                  |
 * | `>= 4` | Debug          | `logger.debug()` will be included                |
 * | `>= 5` | Timing         | Extra performance timing metrics will be written |
 *
 * @group Logger
 */
export type Verbosity = 0 | 1 | 2 | 3 | 4 | 5;

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
	stream?: Writable;
	/**
	 * @experimental
	 */
	captureAll?: boolean;
};

const frames: Array<string> = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

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
	#updater: LogUpdate;
	#frame = 0;
	#stream: Writable;

	#paused = false;
	#updaterTimeout: NodeJS.Timeout | undefined;

	#hasError = false;
	#hasWarning = false;
	#hasInfo = false;
	#hasLog = false;
	#captureAll = false;

	/**
	 * @internal
	 */
	constructor(options: LoggerOptions) {
		this.verbosity = options.verbosity;

		this.#stream = options.stream ?? process.stderr;
		// this.#updater = createLogUpdate(this.#stream);

		this.#captureAll = !!options.captureAll;

		this.#defaultLogger = new LogStep({
			name: '',
			onEnd: this.#onEnd,
			// onMessage: this.#onMessage,
			// verbosity: this.verbosity,
			// stream: this.#stream,
		});

		// if (this.#stream === process.stderr && process.stderr.isTTY && process.env.NODE_ENV !== 'test') {
		// 	process.nextTick(() => {
		// 		this.#runUpdater();
		// 	});
		// }

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
			// this.#defaultLogger.verbosity = this.#verbosity;
			this.#activate(this.#defaultLogger);
		}

		// this.#steps.forEach((step) => (step.verbosity = this.#verbosity));
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
	set stream(stream: Writable) {
		this.#stream = stream;
		// this.#updater.clear();
		// this.#updater = createLogUpdate(this.#stream);
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
	pause(write: boolean = true) {
		this.#paused = true;
		this.#stream.cork();
		// clearTimeout(this.#updaterTimeout);
		if (write) {
			this.#writeSteps();
		}
	}

	/**
	 * Unpause the logger and resume writing buffered logs to `stderr`. See {@link Logger#pause | `logger.pause()`} for more information.
	 */
	unpause() {
		// this.#updater.clear();
		this.#paused = false;
		this.#stream.uncork();
		// this.#runUpdater();
	}

	#runUpdater() {
		if (this.#paused) {
			return;
		}
		this.#updaterTimeout = setTimeout(() => {
			this.#writeSteps();
			this.#frame += 1;
			this.#runUpdater();
		}, 80);
	}

	#writeSteps() {
		if (process.env.NODE_ENV === 'test' || this.verbosity <= 0) {
			return;
		}
		this.#updater(
			this.#steps.map((step) => [` ┌ ${step.name}`, ` └ ${frames[this.#frame % frames.length]}`].join('\n')).join('\n'),
		);
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
	createStep(name: string, { writePrefixes }: { writePrefixes?: boolean } = {}) {
		// const step = new LogStep(name, {
		// 	onEnd: this.#onEnd,
		// 	// onMessage: this.#onMessage,
		// 	verbosity: this.verbosity,
		// 	stream: this.#stream,
		// 	writePrefixes,
		// });

		const step = new LogStep({
			name,
			onEnd: this.#onEnd,
			// onMessage: this.#onMessage,
			// verbosity: this.verbosity,
			// stream: this.#stream,
			// writePrefixes,
		});
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
		this.pause(false);
		// clearTimeout(this.#updaterTimeout);

		// for (const step of this.#steps) {
		// 	this.#activate(step);
		// 	step.warn(
		// 		`Step "${step.name}" did not finish before command shutdown. Fix this issue by updating this command to \`await step.end();\` at the appropriate time.`,
		// 	);
		// 	await step.end();
		// }

		await this.#defaultLogger.end();
		// await this.#defaultLogger.flush();
		destroyCurrent();
	}

	#activate(step: LogStep) {
		const activeStep = this.#steps.find((step) => step.isPiped);

		if (activeStep) {
			// console.log('cannot activate', step.name, 'because', activeStep.name);
			return;
		}

		if (step !== this.#defaultLogger && !this.#defaultLogger.isPaused()) {
			this.#defaultLogger.pause();
			// step.unpipe();
			// this.#defaultLogger.deactivate();
		}

		if (step.isPiped) {
			step.unpipe();
		}

		this.unpause();
		step.pipe(new LogBufferToString({ verbosity: this.#verbosity })).pipe(this.#stream);
		step.isPiped = true;

		// if (!(this.#stream === process.stderr && process.stderr.isTTY)) {
		// 	step.pipe(new LogBufferToString({ verbosity: this.#verbosity })).pipe(this.#stream);
		// 	return;
		// }

		// setImmediate(() => {
		// });
	}

	#onEnd = async (step: LogStep) => {
		if (step === this.#defaultLogger) {
			return;
		}

		const index = this.#steps.findIndex((s) => s === step);
		if (index < 0) {
			return;
		}

		// await new Promise<void>((resolve) => {
		// 	// setImmediate(() => {
		// 	setImmediate(() => {
		// 		resolve();
		// 	});
		// 	// });
		// });

		// this.#updater.clear();
		step.unpipe();
		step.destroy();
		step.isPiped = false;
		// step.destroy();
		// await step.flush();

		// this.#defaultLogger.resume();

		// if (step.hasError && process.env.GITHUB_RUN_ID) {
		// 	this.error('The previous step has errors.');
		// }

		// Remove this step
		this.#steps.splice(index, 1);

		await new Promise<void>((resolve) => {
			setImmediate(() => {
				setImmediate(() => {
					this.#defaultLogger.pause();
					resolve();
				});
			});
		});

		if (this.#steps.length < 1) {
			return;
		}

		this.#activate(this.#steps[0]);
		// this.#steps[0].pipe(new LogBufferToString({ verbosity: this.#verbosity })).pipe(this.#stream);
	};

	// #onMessage = (type: 'error' | 'warn' | 'info' | 'log' | 'debug') => {
	// 	switch (type) {
	// 		case 'error':
	// 			this.#hasError = true;
	// 			this.#defaultLogger.hasError = true;
	// 			break;
	// 		case 'warn':
	// 			this.#hasWarning = true;
	// 			break;
	// 		case 'info':
	// 			this.#hasInfo = true;
	// 			break;
	// 		case 'log':
	// 			this.#hasLog = true;
	// 			break;
	// 		default:
	// 		// no default
	// 	}
	// };
}
