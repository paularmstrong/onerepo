import type { Writable } from 'node:stream';
import { Transform } from 'node:stream';
import restoreCursorDefault from 'restore-cursor';
import { Logger } from './Logger';
import { destroyCurrent, getCurrent, setCurrent } from './global';
import type { LogStep } from './LogStep';
import { prefix } from './transforms/LogStepToString';

export * from './Logger';
export * from './LogStep';
export * from './types';

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
	restoreCursor();
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
export function bufferSubLogger(step: Writable | LogStep): { logger: Logger; end: () => Promise<void> } {
	const logger = getLogger();
	const stream = new Buffered();
	const subLogger = new Logger({ verbosity: logger.verbosity, stream, captureAll: true });

	stream.pipe(step as Writable);

	return {
		logger: subLogger,
		async end() {
			await new Promise<void>((resolve) => {
				setImmediate(async () => {
					stream.unpipe();
					stream.destroy();
					resolve();
				});
			});
		},
	};
}

export const restoreCursor = restoreCursorDefault;

class Buffered extends Transform {
	_transform(
		chunk: Buffer,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		encoding = 'utf8',
		callback: () => void,
	) {
		this.push(
			`${chunk
				.toString()
				.trim()
				.split('\n')
				.map((line) => (line.startsWith(prefix.end) ? `${line}` : ` │ ${line.trim()}`))
				.join('\n')}\n`,
		);
		callback();
	}
}
