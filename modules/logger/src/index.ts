import { Logger } from './Logger';
import type { LogStep } from './LogStep';
import { destroyCurrent, getCurrent, setCurrent } from './global';
import { LogBuffer } from './LogBuffer';

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

	if (!inputStep) {
		await step.end();
	}

	return out;
}

/**
 * Create a new Logger instance that has its output buffered up to a LogStep.
 *
 * ```ts
 * const step = logger.createStep(name, { writePrefixes: false });
 * const subLogger = bufferSubLogger(step);
 * const substep = subLogger.logger.createStep('Sub-step');
 * substep.warning('This gets buffered');
 * await substep.end();
 * await subLogger.end();
 * await step.en();
 * ```
 *
 * @alpha
 * @group Logger
 */
export function bufferSubLogger(step: LogStep): { logger: Logger; end: () => Promise<void> } {
	const logger = getLogger();
	const buffer = new LogBuffer();
	const subLogger = new Logger({ verbosity: logger.verbosity, stream: buffer });
	function proxyChunks(chunk: Buffer) {
		if (subLogger.hasError) {
			step.error(() => chunk.toString().trimEnd());
		} else if (subLogger.hasInfo) {
			step.info(() => chunk.toString().trimEnd());
		} else if (subLogger.hasWarning) {
			step.warn(() => chunk.toString().trimEnd());
		} else if (subLogger.hasLog) {
			step.log(() => chunk.toString().trimEnd());
		} else {
			step.debug(() => chunk.toString().trimEnd());
		}
	}
	buffer.on('data', proxyChunks);

	return {
		logger: subLogger,
		async end() {
			buffer.off('data', proxyChunks);
			await new Promise<void>((resolve) => {
				setImmediate(async () => {
					await subLogger.end();
					buffer.destroy();
					resolve();
				});
			});
		},
	};
}
