import type { Logger } from './Logger';

const loggers: Array<Logger> = [];

function getLoggers(): Array<Logger> {
	return loggers;
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
