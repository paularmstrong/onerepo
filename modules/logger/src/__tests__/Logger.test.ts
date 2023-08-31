import { PassThrough } from 'node:stream';
import pc from 'picocolors';
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
	test.concurrent.each([
		[0, []],
		[1, ['success', 'error']],
		[2, ['success', 'error', 'warn']],
		[3, ['success', 'error', 'warn', 'log']],
		[4, ['success', 'error', 'warn', 'log', 'debug']],
		[5, ['success', 'error', 'warn', 'log', 'debug', 'timing']],
	] as Array<[number, Array<keyof Logger>]>)('verbosity = %d writes %j', async (verbosity, methods) => {
		const stream = new PassThrough();
		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		const logger = new Logger({ verbosity, stream });

		const logs = {
			success: `${pc.green(pc.bold('SUCC'))} a success`,
			error: `${pc.red(pc.bold('ERR'))} an error`,
			warn: `${pc.yellow(pc.bold('WRN'))} a warning`,
			// log: `${pc.cyan(pc.bold('LOG'))} a log`,
			log: ' a log',
			debug: `${pc.magenta(pc.bold('DBG'))} a debug`,
			timing: `${pc.red('⏳')} foo → bar: 0ms`,
		};

		logger.success('a success');
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
	});

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
});
