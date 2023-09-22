import { PassThrough } from 'node:stream';
import pc from 'picocolors';
import type { LoggerOptions } from '../Logger';
import { Logger } from '../Logger';

async function waitStreamEnd(stream: PassThrough) {
	return new Promise<void>((resolve) => {
		setImmediate(() => {
			stream.end(() => {
				resolve();
			});
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
			await waitStreamEnd(stream);

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
		await waitStreamEnd(stream);

		expect(out).toMatch(`${pc.dim(pc.bold('■'))} ${pc.green('✔')} Completed`);
	});

	test('writes logs if verbosity increased after construction', async () => {
		vi.restoreAllMocks();
		const stream = new PassThrough();
		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		const logger = new Logger({ verbosity: 0, stream });
		logger.verbosity = 2;

		logger.warn('this is a warning');

		const step = logger.createStep('tacos');
		await step.end();

		await logger.end();
		await waitStreamEnd(stream);

		expect(out).toEqual(` ${pc.yellow(pc.bold('WRN'))} this is a warning
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
		await waitStreamEnd(stream);

		expect(out).not.toMatch('::group::');
		expect(out).not.toMatch('::endgroup::');
	});
});
