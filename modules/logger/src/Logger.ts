import type logUpdate from 'log-update';
import { createLogUpdate } from 'log-update';
import { Step } from './Step';

type LogUpdate = typeof logUpdate;

type Options = {
	/**
	 * Verbosity from 0 to 3
	 * <= 0 - Silent. No output will be read or written.
	 * >= 1 - Error
	 * >= 2 - Warnings
	 * >= 3 - Log
	 * >= 4 - Debug
	 * >= 5 - Timing
	 */
	verbosity: number;
};

const frames: Array<string> = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export class Logger {
	#logger: Step;
	#steps: Array<Step> = [];
	#verbosity = 0;
	updater: LogUpdate;
	#frame = 0;

	#paused = false;
	#updaterTimeout: NodeJS.Timeout | undefined;

	constructor({ verbosity }: Options) {
		this.verbosity = verbosity;
		this.updater = createLogUpdate(process.stderr);

		this.#logger = new Step('', { onEnd: this.#onEnd, onError: this.#onError, verbosity: this.verbosity });
		this.#logger.activate(true);

		if (process.stderr.isTTY) {
			this.runUpdater();
		}
	}

	get verbosity() {
		return this.#verbosity;
	}

	set verbosity(value: number) {
		this.#verbosity = Math.max(0, value);

		if (this.#logger) {
			this.#logger.verbosity = this.#verbosity;
		}

		this.#steps.forEach((step) => (step.verbosity = this.#verbosity));
	}

	get hasError() {
		return this.#logger.hasError;
	}

	pause() {
		this.#paused = true;
		clearTimeout(this.#updaterTimeout);
		this.#writeSteps();
	}

	unpause() {
		this.updater.clear();
		this.#paused = false;
	}

	runUpdater() {
		if (!this.#logger.active || this.#paused) {
			return;
		}
		this.#updaterTimeout = setTimeout(() => {
			this.#writeSteps();
			this.#frame += 1;
			this.runUpdater();
		}, 80);
	}

	#writeSteps() {
		this.updater(
			this.#steps.map((step) => [...step.status, ` └ ${frames[this.#frame % frames.length]}`].join('\n')).join('\n')
		);
	}

	createStep(name: string) {
		const step = new Step(name, { onEnd: this.#onEnd, onError: this.#onError, verbosity: this.verbosity });
		this.#steps.push(step);
		this.#activate(step);
		return step;
	}

	log(contents: unknown) {
		this.#logger.log(contents);
	}

	error(contents: unknown) {
		this.#logger.error(contents);
	}

	warn(contents: unknown) {
		this.#logger.warn(contents);
	}

	debug(contents: unknown) {
		this.#logger.debug(contents);
	}

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

	#activate = (step: Step) => {
		if (!process.stderr.isTTY) {
			const activeStep = this.#steps.find((step) => step.active);
			if (activeStep) {
				return;
			}
		}

		step.activate();
	};

	#onEnd = async (step: Step) => {
		if (step === this.#logger) {
			return;
		}

		this.updater.clear();
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
