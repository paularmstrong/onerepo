import { Transform } from 'node:stream';

export class LogProgress extends Transform {
	#updaterTimeout?: NodeJS.Timeout;
	#frame: number;
	#written: boolean = false;

	constructor() {
		super();
		// this.#updater = createLogUpdate(this);
		this.#frame = 0;
		this.#runUpdater();
	}

	#runUpdater() {
		clearTimeout(this.#updaterTimeout);
		this.#updaterTimeout = setTimeout(() => {
			// this.push(new Error().stack);
			this.write(` └ ${frames[this.#frame % frames.length]}`);
			this.#written = true;
			this.#frame += 1;
			// this.#runUpdater();
		}, 100);
	}

	_destroy() {
		clearTimeout(this.#updaterTimeout);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_transform(chunk: string | Buffer, encoding = 'utf8', callback: () => void) {
		clearTimeout(this.#updaterTimeout);
		if (this.#written) {
			// Erase the last line
			this.push('\u001B[2K\u001B[G');
			this.#written = false;
		}

		this.push(chunk);
		callback();
		this.#runUpdater();
	}

	_final(callback: () => void) {
		clearTimeout(this.#updaterTimeout);
		this.push(null);
		callback();
	}
}

export const frames: Array<string> = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
