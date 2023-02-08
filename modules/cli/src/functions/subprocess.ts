import { performance } from 'node:perf_hooks';
import { exec, spawn } from 'node:child_process';
import os from 'node:os';
import type { ChildProcess, SpawnOptions } from 'node:child_process';
import { Transform } from 'node:stream';
import { logger } from '../logger';
import type { Step } from '@onerepo/logger';

export interface RunSpec {
	name: string;
	cmd: string;
	args?: Array<string>;
	opts?: SpawnOptions;
	runDry?: boolean;
	step?: Step;
	skipFailures?: boolean;
}

export async function run(options: RunSpec): Promise<[string, string]> {
	return new Promise((resolve, reject) => {
		performance.mark(`${options.name}_start`);
		const { runDry = false, step: inputStep, ...withoutLogger } = options;
		if (options.opts?.stdio === 'inherit') {
			logger.inherit = true;
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
${JSON.stringify(withoutLogger, null, 2)}\n${process.env.ONE_REPO_ROOT}\n`
		);

		const subprocess = start(options);

		subprocess.on('error', (error) => {
			!options.skipFailures && step.error(error);
			return Promise.resolve()
				.then(() => {
					logger.inherit = false;
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
			if (code && isFinite(code)) {
				const error = new SubprocessError(`${out || err || code}`);
				if (!options.skipFailures) {
					step.error(out.trim() || err.trim());
					step.error(`Process exited with code ${code}`);
				}
				return step.end().then(() => {
					logger.inherit = false;
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
 */
export function start(options: Omit<RunSpec, 'runDry' | 'name'>): ChildProcess {
	const { args = [], cmd, opts = {} } = options;

	const subprocess = spawn(cmd, args, {
		cwd: process.env.ONE_REPO_ROOT,
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

export async function sudo(options: Omit<RunSpec, 'opts'>): Promise<[string, string]> {
	const log = logger.createStep(options.name);

	return new Promise((resolve, reject) => {
		log.debug(`Running command: sudo ${options.cmd} ${(options.args || []).join(' ')}\n`);

		exec(
			`sudo ${options.cmd} ${(options.args || []).join(' ')}`,
			{
				cwd: process.env.ONE_REPO_ROOT,
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
					.then(() => log.end())
					.then(() => resolve([stdout, stderr]));
			}
		);
	});
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

/**
 * Batch multiple subprocesses, as many as possible fulfilling N-1 cores. If there are more processes than cores, as each subprocess finishes, a new subprocess will be picked to run, ensuring maximum CPU usage at all times.
 */
export async function batch(processes: Array<RunSpec>, parallel = true): Promise<Array<[string, string] | Error>> {
	const results: Array<[string, string] | Error> = [];

	if (processes.length === 0) {
		return [];
	}

	const tasks = processes.map((proc) => () => {
		return run(proc);
	});

	let failing = false;
	const maxParallel = parallel ? Math.min(os.cpus().length - 1, tasks.length) : 1;

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

export class SubprocessError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export class BatchError extends Error {
	errors: Array<string | SubprocessError> = [];
	constructor(errors: Array<string | SubprocessError>, options?: ErrorOptions) {
		super('Batch process error', options);
		this.errors = errors;
	}
}
