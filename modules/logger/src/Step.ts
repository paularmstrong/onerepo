import { performance } from 'node:perf_hooks';
import pc from 'picocolors';
import { Duplex } from 'node:stream';

type StepOptions = {
	verbosity: number;
	onEnd: (step: Step) => Promise<void>;
	onError: () => void;
};

export class Step {
	#name: string;
	#verbosity: number;
	stream: Duplex;
	#active = false;
	#onEnd: (step: Step) => Promise<void>;
	#onError: () => void;
	#lastThree: Array<string> = [];
	hasError = false;

	constructor(name: string, { onEnd, onError, verbosity }: StepOptions) {
		performance.mark(`start_${name || 'logger'}`);
		this.#verbosity = verbosity;
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

	set verbosity(verbosity: number) {
		this.#verbosity = verbosity;
		this.activate();
	}

	get verbosity() {
		return this.#verbosity;
	}

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
		this.stream.on('data', (chunk) => {
			// All log output goes to stderr. No exceptions.
			// This allows commands to write to stdout and not mix log information with true output.
			// However, if you plan on writing to a file, consider actually writing to a file with the fs api.
			process.stderr.write(chunk.toString());
		});
	}

	async end() {
		const endMark = `end_${this.name || 'logger'}`;
		performance.mark(endMark);

		const duration = Math.round(
			performance.measure(this.name || 'logger', `start_${this.name || 'logger'}`, endMark).duration
		);
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
