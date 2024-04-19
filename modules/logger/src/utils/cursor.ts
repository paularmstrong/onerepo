import restoreCursor from 'restore-cursor';

export function hideCursor() {
	if (!process.stderr.isTTY) {
		return;
	}

	restoreCursor();

	process.stderr.write('\u001B[?25l');
}

export function showCursor() {
	if (!process.stderr.isTTY) {
		return;
	}

	process.stderr.write('\u001B[?25h');
}
