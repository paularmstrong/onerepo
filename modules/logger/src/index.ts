import { Logger } from './Logger';
import type { LogStep } from './LogStep';

export * from './Logger';
export * from './LogStep';

/**
 * This logger is a singleton instance for use across all of oneRepo and its commands.
 *
 * Available as a root import:
 *
 * ```ts
 * import { logger } from 'onerepo';
 * ```
 *
 * Available as extras on Handler functions:
 *
 * ```ts
 * export const handler: Handler = (argv, { logger }) => {
 * 	logger.log('Hello!');
 * };
 * ```
 *
 * @group Logger
 */
export const logger = new Logger({ verbosity: 0 });

/**
 * For cases where multiple processes need to be completed, but should be joined under a single {@link LogStep} to avoid too much noisy output, this safely wraps an asynchronous function and handles step creation and completion, unless a `step` override is given.
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
	fn: (step: LogStep) => Promise<T>
): Promise<T> {
	const { name, step: inputStep } = options;
	const step = inputStep ?? logger.createStep(name);

	const out = await fn(step);

	!inputStep && (await step.end());

	return out;
}
