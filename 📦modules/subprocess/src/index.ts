import { performance } from 'node:perf_hooks';
import { exec, execSync, spawn } from 'node:child_process';
import os from 'node:os';
import { Transform } from 'node:stream';
import type { ChildProcess, SpawnOptions } from 'node:child_process';
import { logger } from '@onerepo/logger';
import type { LogStep } from '@onerepo/logger';

/**
 * @group Subprocess
 */
export interface RunSpec {
	/**
	 * A friendly name for the Step
	 */
	name: string;
	/**
	 * The command to run. Thsi should be an available executable or path to an executable.
	 */
	cmd: string;
	/**
	 * Arguments to pass to the executable
	 */
	args?: Array<string>;
	opts?: SpawnOptions;
	runDry?: boolean;
	step?: LogStep;
	skipFailures?: boolean;
}

/**
 * Spawn a process and capture its `stdout` and `stderr` through a Logger Step. Most oneRepo commands will consist of at least one [`run()`](#run) or [`batch()`](#batch) processes.
 *
 * ```ts
 * await run({
 * 	 name: 'Do some work',
 * 	 cmd: 'echo',
 *   args: ['"hello!"']
 * });
 * ```
 *
 * @group Subprocess
 * @return A promise with an array of `[stdout, stderr]`, as captured from the command run.
 */
export async function run(options: RunSpec): Promise<[string, string]> {
	return new Promise((resolve, reject) => {
		performance.mark(`${options.name}_start`);
		const { runDry = false, step: inputStep, ...withoutLogger } = options;
		if (options.opts?.stdio === 'inherit') {
			logger.pause();
		}

		const step = inputStep ?? logger.createStep(options.name);

		let out = '';
		let err = '';

		if (!runDry && process.env.ONE_REPO_DRY_RUN === 'true') {
			step.log(
				`DRY-RUN command:
		${JSON.stringify(withoutLogger, null, 2)}\n`
			);

			return Promise.resolve()
				.then(() => {
					return !inputStep ? step.end() : Promise.resolve();
				})
				.then(() => {
					resolve([out.trim(), err.trim()]);
				});
		}

		if (inputStep) {
			step.log(`Running: ${options.name}`);
		}

		step.debug(
			`Running command:
${JSON.stringify(withoutLogger, null, 2)}\n${process.env.ONE_REPO_ROOT ?? process.cwd()}\n`
		);

		const subprocess = start(options);

		subprocess.on('error', (error) => {
			!options.skipFailures && step.error(error);
			return Promise.resolve()
				.then(() => {
					logger.unpause();
					return !inputStep ? step.end() : Promise.resolve();
				})
				.then(() => {
					reject(error);
				});
		});

		if (subprocess.stdout && subprocess.stderr) {
			subprocess.stdout.pipe(
				makeTransformer((str: string) => {
					out += str;
					step.log(str);
				})
			);
			subprocess.stderr.pipe(
				makeTransformer((str: string) => {
					err += str;
					step.log(str);
				})
			);
		}

		subprocess.on('exit', (code) => {
			performance.mark(`${options.name}_end`);
			if (code && isFinite(code) && !options.skipFailures) {
				const error = new SubprocessError(`${out || err || code}`);
				step.error(out.trim() || err.trim());
				step.error(`Process exited with code ${code}`);
				return (!inputStep ? step.end() : Promise.resolve()).then(() => {
					logger.unpause();
					reject(error);
				});
			}
			step.timing(`${options.name}_start`, `${options.name}_end`);

			return Promise.resolve()
				.then(() => {
					return !inputStep ? step.end() : Promise.resolve();
				})
				.then(() => {
					resolve([out.trim(), err.trim()]);
				});
		});
	});
}

/**
 * Start a subprocess. For use when control over watching the stdout and stderr or long-running processes that are not expected to complete without SIGINT/SIGKILL.
 *
 * @group Subprocess
 */
export function start(options: Omit<RunSpec, 'runDry' | 'name'>): ChildProcess {
	const { args = [], cmd, opts = {} } = options;

	const subprocess = spawn(cmd, args, {
		cwd: process.env.ONE_REPO_ROOT ?? process.cwd(),
		stdio: ['inherit', 'pipe', 'pipe'],
		...opts,
	});

	if (!subprocess) {
		throw new Error('Unable to start process');
	}

	if (opts.detached) {
		subprocess.unref();
	}

	return subprocess;
}

/**
 * This function is similar to `run`, but can request and run with elevated `sudo` permissions. This function should not be used unless you absolutely _know_ that you will need to spawn an executable with elevated permissions.
 *
 * This function will first check if `sudo` permissions are valid. If not, the logger will warn the user that sudo permissions are being requested and properly pause the animated logger while the user enters their password directly through `stdin`. If permissions are valid, no warning will be given.
 *
 * ```ts
 * await sudo({
 * 	name: 'Change permissions',
 * 	cmd: 'chmod',
 * 	args: ['a+x', '/usr/bin/thing'],
 * 	reason: 'When prompted, please type your password and hit [RETURN] to allow `thing` to be run later',
 * });
 * ```
 *
 * @group Subprocess
 */
export async function sudo(options: Omit<RunSpec, 'opts'> & { reason?: string }): Promise<[string, string]> {
	const log = logger.createStep(options.name);

	return new Promise((resolve, reject) => {
		try {
			execSync('sudo -n true &> /dev/null');
		} catch (e) {
			log.warn('Sudo permissions are required to continue!');
			log.warn(options.reason ?? 'If prompted, please type your password and hit [RETURN].');
			log.debug(`Sudo permissions are being requested to run the following:
		$ ${options.cmd} ${(options.args || []).join(' ')}
	`);
		}
		logger.pause();

		exec(
			`sudo ${options.cmd} ${(options.args || []).join(' ')}`,
			{
				cwd: process.env.ONE_REPO_ROOT ?? process.cwd(),
			},
			(error, stdout, stderr) => {
				if (error) {
					log.error(error);
					return Promise.resolve()
						.then(() => log.end())
						.then(() => reject(error));
				}

				logger.log(stdout);
				logger.log(stderr);

				return Promise.resolve()
					.then(() => {
						logger.unpause();
						return log.end();
					})
					.then(() => resolve([stdout, stderr]));
			}
		);
	});
}

/**
 * Batch multiple subprocesses, similar to `Promise.all`, but only run as many processes at a time fulfilling N-1 cores. If there are more processes than cores, as each process finishes, a new process will be picked to run, ensuring maximum CPU usage at all times.
 *
 * If any process throws a `SubprocessError`, this function will reject with a `BatchError`, but only after _all_ processes have completed running.
 *
 * Most oneRepo commands will consist of at least one [`run()`](#run) or [`batch()`](#batch) processes.
 *
 * ```ts
 * const processes: Array<RunSpec> = [
 * 	{ name: 'Say hello', cmd: 'echo', args: ['"hello"'] },
 * 	{ name: 'Say world', cmd: 'echo', args: ['"world"'] },
 * ];
 *
 * const results = await batch(processes);
 *
 * expect(results).toEqual([['hello', ''], ['world', '']]);
 * ```
 *
 * @group Subprocess
 */
export async function batch(processes: Array<RunSpec>): Promise<Array<[string, string] | Error>> {
	const results: Array<[string, string] | Error> = [];

	if (processes.length === 0) {
		return [];
	}

	const tasks = processes.map((proc) => () => {
		return run(proc);
	});

	let failing = false;
	const cpus = os.cpus().length;
	const maxParallel = Math.min(cpus === 2 ? 2 : cpus - 1, tasks.length);

	return new Promise((resolve, reject) => {
		logger.debug(`Running ${tasks.length} processes with max parallelism ${maxParallel}`);
		function runTask(runner: () => Promise<[string, string]>): Promise<void> {
			return runner()
				.then(([stdout, stderr]) => {
					results.push([stdout, stderr]);
				})
				.catch((e) => {
					failing = true;
					results.push(e);
				})
				.finally(() => {
					runNextTask();
				});
		}

		function runNextTask() {
			if (tasks.length) {
				const runnable = tasks.shift();
				if (runnable) {
					runTask(runnable);
				}
			}

			if (!tasks.length && results.length === processes.length) {
				if (failing) {
					const error = new BatchError(results.filter((r) => r instanceof SubprocessError) as Array<SubprocessError>);
					return reject(error);
				}
				resolve(results);
			}
		}

		tasks.splice(0, maxParallel).forEach((task) => {
			runTask(task);
		});
	});
}

/**
 * @internal
 */
export class SubprocessError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

/**
 * @internal
 */
export class BatchError extends Error {
	errors: Array<string | SubprocessError> = [];
	constructor(errors: Array<string | SubprocessError>, options?: ErrorOptions) {
		super('Batch process error', options);
		this.errors = errors;
	}
}

function makeTransformer(log: (str: string) => void) {
	let out = '';
	return new Transform({
		// The amount of data potentially buffered depends on the highWaterMark option passed into the stream's constructor. https://nodejs.org/docs/latest-v18.x/api/stream.html#stream_buffering
		highWaterMark: 0x100000,
		transform(chunk, encoding, callback) {
			out += chunk.toString('utf8');
			log(chunk.toString('utf8'));
			callback(null, chunk);
		},
		// Always ensure a newline when flushing to prevent running separate streams together
		flush(callback) {
			if (out.length > 0 && !/\n$/.test(out)) {
				callback(null, '\n');
			}
		},
	});
}
