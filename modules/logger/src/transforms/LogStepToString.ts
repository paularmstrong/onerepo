import { Transform } from 'node:stream';
import pc from 'picocolors';
import type { LineType } from '../LogStep';
import { ensureNewline, stringify } from '../utils/string';

export type StepToStringOptions = {
	verbosity: number;
};

export class LogStepToString extends Transform {
	#verbosity: number;

	constructor({ verbosity }: StepToStringOptions) {
		super({ decodeStrings: false });
		this.#verbosity = verbosity;
	}

	_transform(
		chunk: Buffer,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		encoding = 'utf8',
		callback: () => void,
	) {
		try {
			const data = JSON.parse(chunk.toString()) as { type: LineType; contents: string; group?: string };
			// console.log(chunk.toString());
			if (typeMinVerbosity[data.type] <= this.#verbosity) {
				this.push(ensureNewline(`${this.#prefix(data.type, data.group, stringify(data.contents))}`));
			}
		} catch (e) {
			this.push(chunk);
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

export const prefix: Record<LineType, string> = {
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
