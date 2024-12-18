import type { Writable, TransformOptions } from 'node:stream';
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
		step.end();
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
	const stream = new Buffered() as Transform;
	stream.pipe(step as Writable);

	const subLogger = new Logger({ verbosity: step.verbosity, stream, captureAll: true });

	return {
		logger: subLogger,
		async end() {
			// TODO: this promise/immediate may not be necessary
			await new Promise<void>((resolve) => {
				setImmediate(async () => {
					stream.unpipe();
					stream.destroy();
					if (subLogger.hasError) {
						step.hasError = true;
					}
					return resolve();
				});
			});
		},
	};
}

export const restoreCursor = restoreCursorDefault;

class Buffered extends Transform {
	constructor(opts?: TransformOptions) {
		super(opts);
		// We're going to be adding many listeners to this transform. This prevents warnings about _potential_ memory leaks
		// However, we're (hopefully) managing piping, unpiping, and destroying the streams correctly in the Logger
		this.setMaxListeners(0);
	}

	// TODO: The buffered logger seems to have its `end()` method automatically called after the first step
	// is ended. This is a complete mystery, but hacking it to not end saves it from prematurely closing
	// before unpipe+destroy is called.
	// @ts-expect-error
	end() {}

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
				.map((line) => `│ ${line.trim()}`)
				.join('\n')}\n`,
		);
		callback();
	}

	_final(callback: () => void) {
		this.push(null);
		callback();
	}
}
