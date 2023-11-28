import type { Logger } from './Logger';

const sym = Symbol.for('onerepo_loggers');

function getLoggers(): Array<Logger> {
	// @ts-ignore Cannot type symbol as key on global
	if (!global[sym]) {
		// @ts-ignore
		global[sym] = [];
	}
	// @ts-ignore
	return global[sym];
}

export function getCurrent() {
	const loggers = getLoggers();
	return loggers[0];
}

export function setCurrent(logger: Logger) {
	const loggers = getLoggers();
	if (!loggers.includes(logger)) {
		loggers.unshift(logger);
	}
}

export function destroyCurrent() {
	const loggers = getLoggers();
	loggers.shift();
}

export async function destroyAll() {
	const loggers = getLoggers();
	while (loggers.length) {
		try {
			await loggers[0].end();
		} catch (e) {
			// no-op
		}

		loggers.shift();
	}
}
