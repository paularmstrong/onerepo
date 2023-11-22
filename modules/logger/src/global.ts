import type { Logger } from './Logger';

declare global {
	// eslint-disable-next-line no-var
	var ONEREPO_LOGGERS: Array<Logger>;
}

global.ONEREPO_LOGGERS = [];

export function getCurrent() {
	return global.ONEREPO_LOGGERS.length ? global.ONEREPO_LOGGERS[0] : undefined;
}

export function setCurrent(logger: Logger) {
	if (!global.ONEREPO_LOGGERS.includes(logger)) {
		global.ONEREPO_LOGGERS.unshift(logger);
	}
}

export function destroyCurrent() {
	global.ONEREPO_LOGGERS.shift();
}
