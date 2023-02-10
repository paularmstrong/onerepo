import { performance } from 'node:perf_hooks';
import { Duplex } from 'node:stream';
import pc from 'picocolors';
import type logUpdate from 'log-update';
import { createLogUpdate } from 'log-update';

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

	inherit = false;

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

	runUpdater() {
		if (!this.#logger.active || this.inherit) {
			return;
		}
		setTimeout(() => {
			this.updater(
				this.#steps.map((step) => [...step.status, ` └ ${frames[this.#frame % frames.length]}`].join('\n')).join('\n')
			);
			this.#frame += 1;
			this.runUpdater();
		}, 80);
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

type StepOptions = {
	verbosity: number;
	onEnd: (step: Step) => Promise<void>;
	onError: () => void;
};

export class Step {
	#name: string;
	verbosity: number;
	stream: Duplex;
	#active = false;
	#onEnd: (step: Step) => Promise<void>;
	#onError: () => void;
	#lastThree: Array<string> = [];
	hasError = false;

	constructor(name: string, { onEnd, onError, verbosity }: StepOptions) {
		performance.mark(`start_${name}`);
		this.verbosity = verbosity;
		this.#name = name;
		this.#onEnd = onEnd;
		this.#onError = onError;
		this.stream = new LogData();
		if (this.name) {
			this.#writeStream(this.#prefixStart(this.name));
		}
	}

	get name() {
		return this.#name;
	}

	set name(name: string) {
		throw new Error('Cannot set name after instantiation');
	}

	get active() {
		return this.#active;
	}

	set active(value: boolean) {
		throw new Error('Call this.activate() to set active');
	}

	get status(): Array<string> {
		return [this.#prefixStart(this.name), ...this.#lastThree];
	}

	activate(enableWrite = !process.stderr.isTTY) {
		if (this.#active) {
			return;
		}

		this.#active = true;
		if (enableWrite) {
			this.#enableWrite();
		}
	}

	#enableWrite() {
		this.stream.on('data', (chunk) => {
			// All log output goes to stderr. No exceptions.
			// This allows commands to write to stdout and not mix log information with true output.
			// However, if you plan on writing to a file, consider actually writing to a file with the fs api.
			process.stderr.write(chunk.toString());
		});
	}

	async end() {
		const endMark = `end_${this.name}`;
		performance.mark(endMark);

		const duration = Math.round(performance.measure(this.name, `start_${this.name}`, endMark).duration);
		const text = this.name
			? pc.dim(`${duration}ms`)
			: `Completed${this.hasError ? ' with errors' : ''} ${pc.dim(`${duration}ms`)}`;
		this.#writeStream(ensureNewline(this.#prefixEnd(`${this.hasError ? pc.red('✘ ') : pc.green('✔ ')}${text}`)));

		return this.#onEnd(this);
	}

	async flush(): Promise<void> {
		this.#active = true;
		if (process.stderr.isTTY) {
			this.#enableWrite();
		}

		return new Promise((resolve) => {
			if (this.name && this.stream.writable) {
				this.stream.end('');
			}

			resolve();
		});
	}

	error(contents: unknown) {
		this.hasError = true;
		this.#onError();
		if (this.verbosity >= 1) {
			const prefix = pc.red(pc.bold('ERR'));
			this.#writeStream(this.#prefix(prefix, stringify(contents)));
		}
	}

	warn(contents: unknown) {
		if (this.verbosity >= 2) {
			const prefix = pc.yellow(pc.bold('WRN'));
			this.#writeStream(this.#prefix(prefix, stringify(contents)));
		}
	}

	log(contents: unknown) {
		if (this.verbosity >= 3) {
			const prefix = pc.cyan(pc.bold('LOG'));
			this.#writeStream(this.#prefix(this.name ? prefix : '', stringify(contents)));
		}
	}

	debug(contents: unknown) {
		if (this.verbosity >= 4) {
			const prefix = pc.magenta(pc.bold('DBG'));
			this.#writeStream(this.#prefix(prefix, stringify(contents)));
		}
	}

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
		this.stream.write(ensureNewline(line));
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
		return item;
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
	return str.endsWith('\n') ? str : `${str}\n`;
}
