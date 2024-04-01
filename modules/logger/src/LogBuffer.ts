import { Duplex, Transform } from 'node:stream';
import pc from 'picocolors';

type BufferOptions = {
	name: string;
	description?: string;
	onEnd: (step: LogBuffer) => Promise<void>;
};

export class LogBuffer extends Duplex {
	name?: string;
	#hasError: boolean = false;
	#startMark: string;
	#onEnd: BufferOptions['onEnd'];

	isPiped: boolean = false;

	constructor({ description, name, onEnd }: BufferOptions) {
		super({ decodeStrings: false });

		this.#startMark = name || `${performance.now()}`;
		performance.mark(`onerepo_start_${this.#startMark}`, {
			detail: description,
		});

		this.name = name;
		this.#onEnd = onEnd;
		this.#write('start', name);
	}

	_read() {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_write(chunk: string | Buffer, encoding = 'utf8', callback: () => void) {
		// this.push(
		// 	typeof chunk === 'string' || chunk instanceof Buffer ? chunk : `${this.#prefix(prefix[chunk.type], chunk.line)}`,
		// );
		this.push(chunk);
		callback();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// _transform(chunk: string | { type: LineType; line: string }, encoding = 'utf8', callback: () => void) {
	// 	// this.push(typeof chunk);
	// 	this.push(typeof chunk === 'string' ? chunk : `${this.#prefix(prefix[chunk.type], chunk.line)}`);
	// 	callback();
	// }

	_final(callback: () => void) {
		this.push(null);
		callback();
	}

	#write(type: LineType, contents: unknown) {
		this.write(
			Buffer.from(
				JSON.stringify({
					type,
					contents: stringify(contents),
					group: this.name,
				}),
			),
		);
	}

	error(contents: unknown) {
		this.#hasError = true;
		this.#write('error', contents);
	}

	warn(contents: unknown) {
		this.#write('warn', contents);
	}

	info(contents: unknown) {
		this.#write('info', contents);
	}

	log(contents: unknown) {
		this.#write('log', contents);
	}

	debug(contents: unknown) {
		this.#write('debug', contents);
	}

	timing(start: string, end: string) {
		// if (this.verbosity >= 5) {
		const [startMark] = performance.getEntriesByName(start);
		const [endMark] = performance.getEntriesByName(end);
		if (!startMark || !endMark) {
			this.warn(`Unable to log timing. Missing either mark ${start} → ${end}`);
			return;
		}
		this.#write(
			'timing',
			`${startMark.name} → ${endMark.name}: ${Math.round(endMark.startTime - startMark.startTime)}ms`,
		);
		// }
	}

	// @ts-expect-error
	async end() {
		const endMark = performance.mark(`onerepo_end_${this.#startMark}`);
		const [startMark] = performance.getEntriesByName(`onerepo_start_${this.#startMark}`);

		// TODO: jest.useFakeTimers does not seem to be applying to performance correctly
		const duration =
			!startMark || process.env.NODE_ENV === 'test' ? 0 : Math.round(endMark.startTime - startMark.startTime);
		const contents = this.name
			? pc.dim(`${duration}ms`)
			: `Completed${this.#hasError ? ' with errors' : ''} ${pc.dim(`${duration}ms`)}`;
		this.#write('end', contents);
		this.emit('end');
		this.emit('close');
	}
}

const prefix: Record<LineType, string> = {
	// FAIL: pc.red('✘'),
	// SUCCESS: pc.green('✔'),
	timing: pc.red('⏳'),
	start: ' ┌ ',
	end: ' └ ',
	error: pc.red(pc.bold('ERR ')),
	warn: pc.yellow(pc.bold('WRN ')),
	log: pc.cyan(pc.bold('LOG ')),
	debug: pc.magenta(pc.bold('DBG ')),
	info: pc.blue(pc.bold('INFO ')),
};

export type LineType = 'start' | 'end' | 'error' | 'warn' | 'info' | 'log' | 'debug' | 'timing';

type Options = {
	verbosity: number;
};

export class LogBufferToString extends Transform {
	#verbosity: number;

	constructor({ verbosity }: Options) {
		super({ decodeStrings: false });
		this.#verbosity = verbosity;
	}

	_transform(
		chunk: Buffer,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		encoding = 'utf8',
		callback: () => void,
	) {
		const data = JSON.parse(chunk.toString()) as { type: LineType; contents: string; group?: string };
		// console.log(chunk.toString());
		if (typeMinVerbosity[data.type] <= this.#verbosity) {
			this.push(ensureNewline(`${this.#prefix(data.type, data.group, stringify(data.contents))}`));
		}
		callback();
	}

	_final(callback: () => void) {
		this.push(null);
		callback();
	}

	#prefix(type: LineType, group: string | undefined, output: string) {
		if (type === 'end') {
			return `${!group ? '◼︎ ' : prefix[type]}${output}`;
		}
		if (type === 'start') {
			return `${!group ? '➤ ' : prefix[type]}${output}`;
		}
		return output
			.split('\n')
			.map((line) => ` ${group ? '│ ' : ''}${prefix[type]}${line}`)
			.join('\n');
	}
}

const typeMinVerbosity: Record<LineType, number> = {
	start: 1,
	end: 1,
	error: 1,
	info: 1,
	warn: 2,
	log: 3,
	debug: 5,
	timing: 6,
};

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
