import { Duplex } from 'node:stream';

export class LogBuffer extends Duplex {
	_read() {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_write(chunk: string, encoding = 'utf8', callback: () => void) {
		this.push(chunk);
		callback();
	}

	_final(callback: () => void) {
		this.push(null);
		callback();
	}
}
