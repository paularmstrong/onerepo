import { Duplex } from 'node:stream';
import pc from 'picocolors';
import { stringify } from './utils/string';
import type { LineType, LoggedBuffer, Verbosity } from './types';

/**
 * @group Logger
 */
export type LogStepOptions = {
	/**
	 * Wraps all step output within the name provided for the step.
	 */
	name: string;
	/**
	 * Optionally include extra information for performance tracing on this step. This description will be passed through to the [`performanceMark.detail`](https://nodejs.org/docs/latest-v20.x/api/perf_hooks.html#performancemarkdetail) recorded internally for this step.
	 *
	 * Use a [Performance Writer plugin](https://onerepo.tools/plugins/performance-writer/) to read and work with this detail.
	 */
	description?: string;
	/**
	 * The verbosity for this step, inherited from its parent {@link Logger}.
	 */
	verbosity: Verbosity;
};

/**
 * LogSteps are an enhancement of [Node.js duplex streams](https://nodejs.org/docs/latest-v20.x/api/stream.html#class-streamduplex) that enable writing contextual messages to the program's output.
 *
 * Always create steps using the {@link Logger.createStep | `logger.createStep()`} method so that they are properly tracked and linked to the parent logger. Creating a LogStep directly may result in errors and unintentional side effects.
 *
 * ```ts
 * const myStep = logger.createStep();
 * // Do work
 * myStep.info('Did some work');
 * myStep.end();
 * ```
 * @group Logger
 */
export class LogStep extends Duplex {
	/**
	 * @internal
	 */
	name?: string;
	/**
	 * @internal
	 */
	isPiped: boolean = false;

	#startMark: string;
	#verbosity: Verbosity;

	#hasError: boolean = false;
	#hasWarning: boolean = false;
	#hasInfo: boolean = false;
	#hasLog: boolean = false;

	/**
	 * @internal
	 */
	constructor(options: LogStepOptions) {
		const { description, name, verbosity } = options;
		super({ decodeStrings: false, objectMode: true });
		this.#verbosity = verbosity;

		this.#startMark = name || `${performance.now()}`;
		performance.mark(`onerepo_start_${this.#startMark}`, {
			detail: description,
		});

		this.name = name;
		this.#write('start', name);
	}

	/**
	 * Write directly to the step's stream, bypassing any formatting and verbosity filtering.
	 *
	 * :::caution[Advanced]
	 * Since {@link LogStep} implements a [Node.js duplex stream](https://nodejs.org/docs/latest-v20.x/api/stream.html#class-streamduplex) in `objectMode`, it is possible to use internal `write`, `read`, `pipe`, and all other available methods, but may not be fully recommended.
	 * :::
	 *
	 * @group Logging
	 */
	write(
		chunk: LoggedBuffer | string,
		encoding?: BufferEncoding,
		cb?: (error: Error | null | undefined) => void,
	): boolean;

	/**
	 * @internal
	 */
	write(chunk: LoggedBuffer | string, cb?: (error: Error | null | undefined) => void): boolean;

	write(
		// @ts-expect-error
		...args
	) {
		// @ts-expect-error
		return super.write(...args);
	}

	/**
	 * @internal
	 */
	_read() {}

	/**
	 * @internal
	 */
	_write(
		chunk: string | Buffer,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		encoding = 'utf8',
		callback: () => void,
	) {
		this.push(chunk);
		callback();
	}

	/**
	 * @internal
	 */
	_final(callback: () => void) {
		this.push(null);
		callback();
	}

	#write(type: LineType, contents: unknown) {
		this.write({
			type,
			contents: stringify(contents),
			group: this.name,
			verbosity: this.#verbosity,
		} satisfies LoggedBuffer);
	}

	set verbosity(verbosity: Verbosity) {
		this.#verbosity = verbosity;
	}

	/**
	 * @internal
	 */
	set hasError(hasError: boolean) {
		this.#hasError = this.#hasError || hasError;
	}

	/**
	 * Whether this step has logged an error message.
	 */
	get hasError() {
		return this.#hasError;
	}

	/**
	 * @internal
	 */
	set hasWarning(hasWarning: boolean) {
		this.#hasWarning = this.#hasWarning || hasWarning;
	}

	/**
	 * Whether this step has logged a warning message.
	 */
	get hasWarning() {
		return this.#hasWarning;
	}

	/**
	 * @internal
	 */
	set hasInfo(hasInfo: boolean) {
		this.#hasInfo = this.#hasInfo || hasInfo;
	}

	/**
	 * Whether this step has logged an info-level message.
	 */
	get hasInfo() {
		return this.#hasInfo;
	}

	/**
	 * @internal
	 */
	set hasLog(hasLog: boolean) {
		this.#hasLog = this.#hasLog || hasLog;
	}

	/**
	 * Whether this step has logged a log-level message.
	 */
	get hasLog() {
		return this.#hasLog;
	}

	/**
	 * Log an error message for this step. Any error log will cause the entire command run in oneRepo to fail and exit with code `1`. Error messages will only be written to the program output if the {@link Logger.verbosity | `verbosity`} is set to 1 or greater – even if not written, the command will still fail and include an exit code.
	 *
	 *
	 * ```ts
	 * const step = logger.createStep('My step');
	 * step.error('This message will be recorded and written out as an "ERR" labeled message');
	 * step.end();
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged error:
	 *
	 * ```ts
	 * step.error(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
	 * ```
	 *
	 * @param contents Any value may be logged as an error, but will be stringified upon output. If a function is given with no arguments, the function will be executed and its response will be stringified for output.
	 *
	 * @group Logging
	 */
	error(contents: unknown) {
		this.hasError = true;
		this.#write('error', contents);
	}

	/**
	 * Log a warning message for this step. Warnings will _not_ cause oneRepo commands to fail. Warning messages will only be written to the program output if the {@link Logger.verbosity | `verbosity`} is set to 2 or greater.
	 *
	 *
	 * ```ts
	 * const step = logger.createStep('My step');
	 * step.warn('This message will be recorded and written out as a "WRN" labeled message');
	 * step.end();
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged warning:
	 *
	 * ```ts
	 * step.warn(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
	 * ```
	 *
	 * @param contents Any value may be logged as a warning, but will be stringified upon output. If a function is given with no arguments, the function will be executed and its response will be stringified for output.
	 *
	 * @group Logging
	 */
	warn(contents: unknown) {
		this.hasWarning = true;
		this.#write('warn', contents);
	}

	/**
	 * Log an informative message for this step. Info messages will only be written to the program output if the {@link Logger.verbosity | `verbosity`} is set to 1 or greater.
	 *
	 * ```ts
	 * const step = logger.createStep('My step');
	 * step.info('This message will be recorded and written out as an "INFO" labeled message');
	 * step.end();
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:
	 *
	 * ```ts
	 * step.info(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
	 * ```
	 *
	 * @param contents Any value may be logged as info, but will be stringified upon output. If a function is given with no arguments, the function will be executed and its response will be stringified for output.
	 *
	 * @group Logging
	 */
	info(contents: unknown) {
		this.hasInfo = true;
		this.#write('info', contents);
	}

	/**
	 * Log a message for this step. Log messages will only be written to the program output if the {@link Logger.verbosity | `verbosity`} is set to 3 or greater.
	 *
	 * ```ts
	 * const step = logger.createStep('My step');
	 * step.log('This message will be recorded and written out as an "LOG" labeled message');
	 * step.end();
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:
	 *
	 * ```ts
	 * step.log(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
	 * ```
	 *
	 * @param contents Any value may be logged, but will be stringified upon output. If a function is given with no arguments, the function will be executed and its response will be stringified for output.
	 *
	 * @group Logging
	 */
	log(contents: unknown) {
		this.hasLog = true;
		this.#write('log', contents);
	}

	/**
	 * Log a debug message for this step. Debug messages will only be written to the program output if the {@link Logger.verbosity | `verbosity`} is set to 4 or greater.
	 *
	 * ```ts
	 * const step = logger.createStep('My step');
	 * step.debug('This message will be recorded and written out as an "DBG" labeled message');
	 * step.end();
	 * ```
	 *
	 * If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged debug information:
	 *
	 * ```ts
	 * step.debug(() => bigArray.map((item) => `- ${item.name}`).join('\n'));
	 * ```
	 *
	 * @param contents Any value may be logged as a debug message, but will be stringified upon output. If a function is given with no arguments, the function will be executed and its response will be stringified for output.
	 *
	 * @group Logging
	 */
	debug(contents: unknown) {
		this.#write('debug', contents);
	}

	/**
	 * Log extra performance timing information.
	 *
	 * Timing information will only be written to the program output if the {@link Logger.verbosity | `verbosity`} is set to 5.
	 *
	 * ```ts
	 * const myStep = logger.createStep('My step');
	 * performance.mark('start');
	 * // do work
	 * performance.mark('end');
	 * myStep.timing('start', 'end');
	 * myStep.end();
	 * ```
	 *
	 * @group Logging
	 */
	timing(start: string, end: string) {
		const [startMark] = performance.getEntriesByName(start);
		const [endMark] = performance.getEntriesByName(end);
		if (!startMark || !endMark) {
			this.warn(`Unable to log timing. Missing either mark ${start} → ${end}`);
			return;
		}
		this.#write(
			'timing',
			`${startMark.name} → ${endMark.name}: ${Math.round(endMark.startTime - startMark.startTime)}ms`,
		);
	}

	/**
	 * Signal the end of this step. After this method is called, it will no longer accept any more logs of any variety and will be removed from the parent Logger's queue.
	 *
	 * Failure to call this method will result in a warning and potentially fail oneRepo commands. It is important to ensure that each step is cleanly ended before returning from commands.
	 *
	 * ```ts
	 * const myStep = logger.createStep('My step');
	 * // do work
	 * myStep.end();
	 * ```
	 */
	end(callback?: () => void) {
		// Makes calling `.end()` multiple times safe.
		// TODO: make this unnecessary
		if (this.writableEnded) {
			throw new Error(`Called step.end() multiple times on step "${this.name}"`);
		}

		const endMark = performance.mark(`onerepo_end_${this.#startMark}`);
		const [startMark] = performance.getEntriesByName(`onerepo_start_${this.#startMark}`);

		// TODO: jest.useFakeTimers does not seem to be applying to performance correctly
		const duration =
			!startMark || process.env.NODE_ENV === 'test' ? 0 : Math.round(endMark.startTime - startMark.startTime);
		const contents = this.name
			? pc.dim(`${duration}ms`)
			: `Completed${this.hasError ? ' with errors' : ''} ${pc.dim(`${duration}ms`)}`;

		return super.end(
			{
				type: 'end',
				contents: stringify(contents),
				group: this.name,
				hasError: this.#hasError,
				verbosity: this.#verbosity,
			} satisfies LoggedBuffer,
			callback,
		);
	}
}
