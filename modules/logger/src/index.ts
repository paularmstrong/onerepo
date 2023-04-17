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
 * @group Logger
 */
export async function stepWrapper<T>(
	{
		name,
		step: inputStep,
	}: {
		name: string;
		step?: LogStep;
	},
	fn: (step: LogStep) => Promise<T>
): Promise<T> {
	const step = inputStep ?? logger.createStep(name);

	const out = await fn(step);

	!inputStep && (await step.end());

	return out;
}
