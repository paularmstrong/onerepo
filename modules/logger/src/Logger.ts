import type logUpdate from 'log-update';
import { createLogUpdate } from 'log-update';
import { LogStep } from './LogStep';

type LogUpdate = typeof logUpdate;

export interface LoggerOptions {
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
 * ```ts
 * import { logger } from 'onerepo';
 * ```
 */
export class Logger {
	#logger: LogStep;
	#steps: Array<LogStep> = [];
	#verbosity = 0;
	#updater: LogUpdate;
	#frame = 0;

	#paused = false;
	#updaterTimeout: NodeJS.Timeout | undefined;

	constructor(options: LoggerOptions) {
		this.verbosity = options.verbosity;

		this.#updater = createLogUpdate(process.stderr);
		this.#logger = new LogStep('', { onEnd: this.#onEnd, onError: this.#onError, verbosity: this.verbosity });
		this.#logger.activate(true);

		if (process.stderr.isTTY) {
			this.#runUpdater();
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
	 * When the terminal is a TTY, steps are automatically animated with a progress indicator. There are times when it's necessary to stop this animation, like when needing to capture user input from `stdin`. Call the `pause()` method before requesting input and [`unpause()`](#unpause) when complete.
	 *
	 * This process is also automated by the [`run()`](/docs/core/api/public/#run) function when `stdio` is set to `pipe`.
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
	 * See [`pause`](#pause) for more information.
	 */
	unpause() {
		this.#updater.clear();
		this.#paused = false;
	}

	#runUpdater() {
		if (!this.#logger.active || this.#paused) {
			return;
		}
		this.#updaterTimeout = setTimeout(() => {
			this.#writeSteps();
			this.#frame += 1;
			this.#runUpdater();
		}, 80);
	}

	#writeSteps() {
		this.#updater(
			this.#steps.map((step) => [...step.status, ` └ ${frames[this.#frame % frames.length]}`].join('\n')).join('\n')
		);
	}

	/**
	 * Create a sub-step, [`LogStep`](/docs/core/api/classes/LogStep/), for the logger. This and any other step will be tracked and required to finish before exit.
	 *
	 * ```ts
	 * const step = logger.createStep('Do fun stuff');
	 * // do some work
	 * await step.end();
	 * ```
	 */
	createStep(name: string) {
		const step = new LogStep(name, { onEnd: this.#onEnd, onError: this.#onError, verbosity: this.verbosity });
		this.#steps.push(step);
		this.#activate(step);
		return step;
	}

	/**
	 * This is a pass-through for the main step’s [`log()` method](/docs/core/api/classes/LogStep/#log).
	 */
	log(contents: unknown) {
		this.#logger.log(contents);
	}

	/**
	 * This is a pass-through for the main step’s [`error()` method](/docs/core/api/classes/LogStep/#error).
	 */
	error(contents: unknown) {
		this.#logger.error(contents);
	}

	/**
	 * This is a pass-through for the main step’s [`warn()` method](/docs/core/api/classes/LogStep/#warn).
	 */
	warn(contents: unknown) {
		this.#logger.warn(contents);
	}

	/**
	 * This is a pass-through for the main step’s [`debug()` method](/docs/core/api/classes/LogStep/#debug).
	 */
	debug(contents: unknown) {
		this.#logger.debug(contents);
	}

	/**
	 * This is a pass-through for the main step’s [`timing()` method](/docs/core/api/classes/LogStep/#timing).
	 */
	timing(start: string, end: string) {
		this.#logger.timing(start, end);
	}

	async end() {
		for (const step of this.#steps) {
			this.#activate(step);
			await step.end();
			await step.flush();
		}
		await this.#logger.end();
		await this.#logger.flush();

		return new Promise<void>((resolve) => {
			setImmediate(() => {
				resolve();
			});
		});
	}

	#activate = (step: LogStep) => {
		if (!process.stderr.isTTY) {
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
