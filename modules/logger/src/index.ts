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
 */
export const logger = new Logger({ verbosity: 0 });

type WrapperArgs = {
	name: string;
	step?: LogStep;
};

export async function stepWrapper<T>(
	{ name, step: inputStep }: WrapperArgs,
	fn: (step: LogStep) => Promise<T>
): Promise<T> {
	const step = inputStep ?? logger.createStep(name);

	const out = await fn(step);

	!inputStep && (await step.end());

	return out;
}
