import { Transform } from 'node:stream';
import pc from 'picocolors';
import type { LineType, LoggedBuffer } from '../types';
import { ensureNewline, stringify } from '../utils/string';

export class LogStepToString extends Transform {
	constructor() {
		super({ decodeStrings: false });
	}

	_transform(
		chunk: Buffer,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		encoding = 'utf8',
		callback: () => void,
	) {
		try {
			const data = JSON.parse(chunk.toString()) as LoggedBuffer;
			if (typeMinVerbosity[data.type] <= data.verbosity) {
				this.push(ensureNewline(`${this.#prefix(data.type, data.group, stringify(data.contents), data.hasError)}`));
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

	#prefix(type: LineType, group: string | undefined, output: string, hasError?: boolean) {
		if (type === 'end') {
			return `${!group ? pc.bold(pc.dim('◼︎ ')) : prefix[type]}${hasError ? pc.red('✘') : pc.green('✔')} ${output}`;
		}
		if (type === 'start') {
			return `${!group ? pc.bold(pc.dim('➤ ')) : prefix[type]}${output}`;
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
	timing: pc.red('⏳'),
	start: ' ┌ ',
	end: ' └ ',
	error: pc.red(pc.bold('ERR ')),
	warn: pc.yellow(pc.bold('WRN ')),
	log: pc.cyan(pc.bold('LOG ')),
	debug: pc.magenta(pc.bold('DBG ')),
	info: pc.blue(pc.bold('INFO ')),
};
