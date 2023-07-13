import type { Writable } from 'node:stream';
import { createLogUpdate } from 'log-update';
import type logUpdate from 'log-update';
import { LogStep } from './LogStep';

type LogUpdate = typeof logUpdate;

interface LoggerOptions {
	/**
	 * Verbosity ranges from 0 to 5
	 *
	 * | Value  | What     | Description                                      |
	 * | ------ | -------- | ------------------------------------------------ |
	 * | `<= 0` | Silent   | No output will be read or written.               |
	 * | `>= 1` | Error    |                                                  |
	 * | `>= 2` | Warnings |                                                  |
	 * | `>= 3` | Log      |                                                  |
	 * | `>= 4` | Debug    | `logger.debug()` will be included                |
	 * | `>= 5` | Timing   | Extra performance timing metrics will be written |
	 */
	verbosity: number;
	/**
	 * Advanced – override the writable stream in order to pipe logs elsewhere. Mostly used for dependency injection for `@onerepo/test-cli`.
	 */
	stream?: Writable;
}

const frames: Array<string> = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

/**
 * The oneRepo logger helps build commands and capture output from spawned subprocess in a way that's both delightful to the end user and includes easy to scan and follow output.
 *
 * All output will be redirected from `stdout` to `stderr` to ensure order of output and prevent confusion of what output can be piped and written to files.
 *
 * You should not need to construct instances of the `Logger` directly, but instead import a singleton instead:
 *
 * If the current terminal is a TTY, output will be buffered and asynchronous steps will animated with a progress logger.
 *
 * See {@link !HandlerExtra | `HandlerExtra`} for access the the global Logger instance.
 *
 * @group Logger
 */
export class Logger {
	#logger: LogStep;
	#steps: Array<LogStep> = [];
	#verbosity = 0;
	#updater: LogUpdate;
	#frame = 0;
	#stream: Writable;

	#paused = false;
	#updaterTimeout: NodeJS.Timeout | undefined;

	/**
	 * @internal
	 */
	constructor(options: LoggerOptions) {
		this.verbosity = options.verbosity;

		this.#stream = options.stream ?? process.stderr;
		this.#updater = createLogUpdate(this.#stream);

		this.#logger = new LogStep('', {
			onEnd: this.#onEnd,
			onError: this.#onError,
			verbosity: this.verbosity,
			stream: this.#stream,
		});

		if (this.#stream === process.stderr && process.stderr.isTTY && process.env.NODE_ENV !== 'test') {
			process.nextTick(() => {
				this.#runUpdater();
			});
		}
	}

	get verbosity() {
		return this.#verbosity;
	}

	/**
	 * Recursively applies the new verbosity to the logger and all of its active steps.
	 */
	set verbosity(value: number) {
		this.#verbosity = Math.max(0, value);

		if (this.#logger) {
			this.#logger.verbosity = this.#verbosity;
			this.#logger.activate(true);
		}

		this.#steps.forEach((step) => (step.verbosity = this.#verbosity));
	}

	/**
	 * Whether or not an error has been sent to the logger or any of its steps. This is not necessarily indicative of uncaught thrown errors, but solely on whether `.error()` has been called in the `Logger` or any `Step` instance.
	 */
	get hasError() {
		return this.#logger.hasError;
	}

	/**
	 * Escape hatch, mostly for testing purposes. You probably shouldn’t use this.
	 */
	set hasError(has: boolean) {
		this.#logger.hasError = has;
	}

	/**
	 * @internal
	 */
	set stream(stream: Writable) {
		this.#stream = stream;
		this.#updater.clear();
		this.#updater = createLogUpdate(this.#stream);
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
		this.#paused = true;
		clearTimeout(this.#updaterTimeout);
		this.#writeSteps();
	}

	/**
	 * Unpause the logger and resume writing buffered logs to `stderr`. See {@link Logger#pause | `logger.pause()`} for more information.
	 */
	unpause() {
		this.#updater.clear();
		this.#paused = false;
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
			this.#steps.map((step) => [...step.status, ` └ ${frames[this.#frame % frames.length]}`].join('\n')).join('\n'),
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
	createStep(name: string) {
		const step = new LogStep(name, {
			onEnd: this.#onEnd,
			onError: this.#onError,
			verbosity: this.verbosity,
			stream: this.#stream,
		});
		this.#steps.push(step);
		this.#activate(step);
		return step;
	}

	/**
	 * Log an error. This will cause the root logger to include an error and fail a command. This is a pass-through for the main step’s {@link LogStep#log | `log()`} method.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	log(contents: unknown) {
		this.#logger.log(contents);
	}

	/**
	 * Log a warning. Does not have any effect on the command run, but will be called out. This is a pass-through for the main step’s {@link LogStep#error | `error()`} method.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	error(contents: unknown) {
		this.#logger.error(contents);
	}

	/**
	 * Log general information. This is a pass-through for the main step’s {@link LogStep#warn | `warn()`} method.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	warn(contents: unknown) {
		this.#logger.warn(contents);
	}

	/**
	 * Extra debug logging when verbosity greater than or equal to 4. This is a pass-through for the main step’s {@link LogStep#debug | `debug()`} method.
	 *
	 * @group Logging
	 * @param contents Any value that can be converted to a string for writing to `stderr`.
	 */
	debug(contents: unknown) {
		this.#logger.debug(contents);
	}

	/**
	 * Log timing information between two [Node.js performance mark names](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#performancemarkname-options). This is a pass-through for the main step’s {@link LogStep#timing | `timing()`} method.
	 *
	 * @group Logging
	 * @param start A `PerformanceMark` entry name
	 * @param end A `PerformanceMark` entry name
	 */
	timing(start: string, end: string) {
		this.#logger.timing(start, end);
	}

	/**
	 * @internal
	 */
	async end() {
		this.#paused = true;
		for (const step of this.#steps) {
			this.#activate(step);
			await step.end();
		}

		clearTimeout(this.#updaterTimeout);
		await this.#logger.end();
		await this.#logger.flush();
	}

	#activate = (step: LogStep) => {
		if (!(this.#stream === process.stderr && process.stderr.isTTY)) {
			const activeStep = this.#steps.find((step) => step.active);
			if (activeStep) {
				return;
			}
		}

		step.activate();
	};

	#onEnd = async (step: LogStep) => {
		if (step === this.#logger) {
			return;
		}

		this.#updater.clear();
		await step.flush();

		const index = this.#steps.findIndex((s) => s === step);
		if (index >= 0) {
			this.#steps.splice(index, 1);
		}
		if (this.#steps.length) {
			this.#activate(this.#steps[0]);
		}
	};

	#onError = () => {
		this.#logger.hasError = true;
	};
}
