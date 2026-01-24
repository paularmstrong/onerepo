import { PassThrough } from 'node:stream';
import pc from 'picocolors';
import type { LoggerOptions } from '../Logger';
import { Logger } from '../Logger.ts';
import type { LogStep } from '../LogStep';

async function runPendingImmediates() {
	return new Promise<void>((resolve) => {
		setImmediate(() => {
			resolve();
		});
	});
}

describe('Logger', () => {
	let runId: string | undefined;

	beforeEach(() => {
		runId = process.env.GITHUB_RUN_ID;
		delete process.env.GITHUB_RUN_ID;
	});

	afterEach(() => {
		process.env.GITHUB_RUN_ID = runId;
	});

	test.concurrent.each([
		[0, []],
		[1, ['info', 'error']],
		[2, ['info', 'error', 'warn']],
		[3, ['info', 'error', 'warn', 'log']],
		[4, ['info', 'error', 'warn', 'log', 'debug']],
		[5, ['info', 'error', 'warn', 'log', 'debug', 'timing']],
	] as Array<[LoggerOptions['verbosity'], Array<keyof Logger>]>)(
		'verbosity = %d writes %j',
		async (verbosity, methods) => {
			const stream = new PassThrough();
			let out = '';
			stream.on('data', (chunk) => {
				out += chunk.toString();
			});

			const logger = new Logger({ verbosity, stream });

			const logs = {
				info: `${pc.blue(pc.bold('INFO'))} some information`,
				error: `${pc.red(pc.bold('ERR'))} an error`,
				warn: `${pc.yellow(pc.bold('WRN'))} a warning`,
				// log: `${pc.cyan(pc.bold('LOG'))} a log`,
				log: ' a log',
				debug: `${pc.magenta(pc.bold('DBG'))} a debug`,
				timing: `${pc.red('⏳')} foo → bar: 0ms`,
			};

			logger.info('some information');
			logger.error('an error');
			logger.warn('a warning');
			logger.log('a log');
			logger.debug('a debug');
			performance.mark('foo');
			performance.mark('bar');
			logger.timing('foo', 'bar');

			await logger.end();

			for (const [method, str] of Object.entries(logs)) {
				// @ts-ignore
				if (!methods.includes(method)) {
					expect(out).not.toMatch(str);
				} else {
					expect(out).toMatch(str);
				}
			}
		},
	);

	test('logs "completed" message', async () => {
		const stream = new PassThrough();
		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		const logger = new Logger({ verbosity: 2, stream });

		const step = logger.createStep('tacos');
		await step.end();

		await logger.end();

		expect(out).toMatch(`${pc.dim(pc.bold('■'))} ${pc.green('✔')} Completed`);
	});

	test('logs "completed with errors" message', async () => {
		const stream = new PassThrough();
		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		const logger = new Logger({ verbosity: 2, stream });

		const step = logger.createStep('tacos');
		step.error('foo');
		await step.end();

		await logger.end();

		expect(out).toMatch(`${pc.dim(pc.bold('■'))} ${pc.red('✘')} Completed with errors`);
	});

	test('writes logs if verbosity increased after construction', async () => {
		const stream = new PassThrough();
		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		const logger = new Logger({ verbosity: 0, stream });
		logger.verbosity = 2;

		logger.warn('this is a warning');
		await runPendingImmediates();
		const step = logger.createStep('tacos');
		await step.end();

		await logger.end();

		expect(out).toEqual(`  ${pc.yellow(pc.bold('WRN'))} this is a warning
 ┌ tacos
 └ ${pc.green('✔')} ${pc.dim('0ms')}
 ${pc.dim(pc.bold('■'))} ${pc.green('✔')} Completed ${pc.dim('0ms')}
`);
	});

	test('does not group the root logger with GITHUB_RUN_ID', async () => {
		process.env.GITHUB_RUN_ID = 'yes';
		const stream = new PassThrough();
		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		const logger = new Logger({ verbosity: 3, stream });

		logger.log('Hello');

		await logger.end();

		expect(out).not.toMatch('::group::');
		expect(out).not.toMatch('::endgroup::');
	});

	test.concurrent.each([
		['error', 'hasError'],
		['warn', 'hasWarning'],
		['info', 'hasInfo'],
		['log', 'hasLog'],
	] as Array<[keyof InstanceType<typeof LogStep>, keyof InstanceType<typeof Logger>]>)(
		'calling %s() on a step sets %s to true',
		async (method, getter) => {
			const stream = new PassThrough();
			const logger = new Logger({ verbosity: 2, stream });

			const step = logger.createStep('tacos');
			await step.end();

			expect(logger[getter]).toBe(false);

			const step2 = logger.createStep('burritos');
			// @ts-ignore
			step2[method]('yum');
			await step2.end();

			expect(logger[getter]).toBe(true);

			await logger.end();
			stream.destroy();
		},
	);
});
