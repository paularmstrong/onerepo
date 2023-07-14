import { Logger } from './Logger';
import type { LogStep } from './LogStep';

export * from './Logger';
export * from './LogStep';

const loggerSym = Symbol.for('onerepo-logger');

/**
 * This gets the logger singleton for use across all of oneRepo and its commands.
 *
 * Available directly as {@link !HandlerExtra | `HandlerExtra`} on {@link !Handler | `Handler`} functions:
 *
 * ```ts
 * export const handler: Handler = (argv, { logger }) => {
 * 	logger.log('Hello!');
 * };
 * ```
 * @group Logger
 */
export function getLogger(opts: Partial<ConstructorParameters<typeof Logger>[0]> = {}): Logger {
	// @ts-ignore
	if (!global[loggerSym]) {
		// @ts-ignore
		global[loggerSym] = new Logger({ verbosity: 0, ...opts });
	}

	const logger = // @ts-ignore
		global[loggerSym] as Logger;

	if (opts.verbosity) {
		logger.verbosity = opts.verbosity;
	}
	if (opts.stream) {
		logger.stream = opts.stream;
	}

	return logger;
}

/**
 * @internal
 */
export function destroyLogger() {
	if (!(loggerSym in global)) {
		return;
	}
	// @ts-ignore
	global[loggerSym] = null;
	// @ts-ignore
	delete global[loggerSym];
}

/**
 * For cases where multiple processes need to be completed, but should be joined under a single {@link LogStep | `LogStep`} to avoid too much noisy output, this safely wraps an asynchronous function and handles step creation and completion, unless a `step` override is given.
 *
 * @example
 *
 * ```ts
 * export async function exists(filename: string, { step }: Options = {}) {
 * 	return stepWrapper({ step, name: 'Step fallback name' }, (step) => {
 * 		return // do some work
 * 	});
 * }
 * ```
 *
 * @group Logger
 */
export async function stepWrapper<T>(
	options: {
		name: string;
		step?: LogStep;
	},
	fn: (step: LogStep) => Promise<T>,
): Promise<T> {
	const { name, step: inputStep } = options;
	const step = inputStep ?? getLogger().createStep(name);

	const out = await fn(step);

	!inputStep && (await step.end());

	return out;
}
