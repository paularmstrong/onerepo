import { Duplex } from 'node:stream';
import pc from 'picocolors';
import { stringify } from './utils/string';
import type { LineType, LoggedBuffer, Verbosity } from './types';

export type LogStepOptions = {
	name: string;
	description?: string;
	verbosity: Verbosity;
};

export class LogStep extends Duplex {
	name?: string;
	#startMark: string;
	#verbosity: Verbosity;

	isPiped: boolean = false;

	#hasError: boolean = false;
	#hasWarning: boolean = false;
	#hasInfo: boolean = false;
	#hasLog: boolean = false;

	constructor({ description, name, verbosity }: LogStepOptions) {
		super({ decodeStrings: false });
		this.#verbosity = verbosity;

		this.#startMark = name || `${performance.now()}`;
		performance.mark(`onerepo_start_${this.#startMark}`, {
			detail: description,
		});

		this.name = name;
		this.#write('start', name);
	}

	_read() {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_write(chunk: string | Buffer, encoding = 'utf8', callback: () => void) {
		this.push(chunk);
		callback();
	}

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
					verbosity: this.#verbosity,
				} satisfies LoggedBuffer),
			),
		);
	}

	set verbosity(verbosity: Verbosity) {
		this.#verbosity = verbosity;
	}

	get hasError() {
		return this.#hasError;
	}

	get hasWarning() {
		return this.#hasWarning;
	}

	get hasInfo() {
		return this.#hasInfo;
	}

	get hasLog() {
		return this.#hasLog;
	}

	error(contents: unknown) {
		this.#hasError = true;
		this.#write('error', contents);
	}

	warn(contents: unknown) {
		this.#hasWarning = true;
		this.#write('warn', contents);
	}

	info(contents: unknown) {
		this.#hasInfo = true;
		this.#write('info', contents);
	}

	log(contents: unknown) {
		this.#hasLog = true;
		this.#write('log', contents);
	}

	debug(contents: unknown) {
		this.#write('debug', contents);
	}

	timing(start: string, end: string) {
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
	}

	end() {
		// Makes calling `.end()` multiple times safe.
		// TODO: make this unnecessary
		if (this.writableEnded) {
			throw new Error(`Called step.end() multiple times on step "${this.name}"`);
		}

		const endMark = performance.mark(`onerepo_end_${this.#startMark}`);
		const [startMark] = performance.getEntriesByName(`onerepo_start_${this.#startMark}`);

		// TODO: jest.useFakeTimers does not seem to be applying to performance correctly
		const duration =
			!startMark || process.env.NODE_ENV === 'test' ? 0 : Math.round(endMark.startTime - startMark.startTime);
		const contents = this.name
			? pc.dim(`${duration}ms`)
			: `Completed${this.#hasError ? ' with errors' : ''} ${pc.dim(`${duration}ms`)}`;

		return super.end(
			Buffer.from(
				JSON.stringify({
					type: 'end',
					contents: stringify(contents),
					group: this.name,
					hasError: this.#hasError,
					verbosity: this.#verbosity,
				} satisfies LoggedBuffer),
			),
		);
	}
}
