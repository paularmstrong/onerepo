import { Logger } from './Logger';
import type { LogStep } from './LogStep';
import { destroyCurrent, getCurrent, setCurrent } from './global';

export * from './Logger';
export * from './LogStep';

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
	let logger = getCurrent();
	if (!logger) {
		logger = new Logger({ verbosity: 0, ...opts });
		setCurrent(logger);
	}

	logger.verbosity = opts.verbosity ?? logger.verbosity;

	if (opts.stream) {
		logger.stream = opts.stream;
	}

	return logger;
}

/**
 * @internal
 */
export function destroyLogger() {
	destroyCurrent();
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
