import type { Logger } from './Logger.ts';

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
