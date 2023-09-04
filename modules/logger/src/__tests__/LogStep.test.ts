import { PassThrough } from 'node:stream';
import pc from 'picocolors';
import { LogStep } from '../LogStep';

async function waitStreamEnd(stream: PassThrough) {
	return new Promise<void>((resolve) => {
		stream.on('end', () => {
			resolve();
		});
		stream.end();
	});
}

describe('LogStep', () => {
	let originalRunId: string | undefined;

	beforeEach(() => {
		originalRunId = process.env.GITHUB_RUN_ID;
		delete process.env.GITHUB_RUN_ID;
	});

	afterEach(() => {
		process.env.GITHUB_RUN_ID = originalRunId;
	});

	test('setup', async () => {
		const onEnd = jest.fn();
		const onError = jest.fn();
		const step = new LogStep('tacos', { onEnd, onError, verbosity: 3 });

		expect(step.name).toBe('tacos');
		expect(step.verbosity).toBe(3);
		expect(step.active).toBe(false);
		expect(step.status).toEqual([' ┌ tacos']);
	});

	test('can be activated', async () => {
		const onEnd = jest.fn();
		const onError = jest.fn();
		const step = new LogStep('tacos', { onEnd, onError, verbosity: 3 });
		step.activate();

		expect(step.active).toBe(true);
	});

	test('writes group & endgroup when GITHUB_RUN_ID is set', async () => {
		process.env.GITHUB_RUN_ID = 'yes';
		const onEnd = jest.fn(() => Promise.resolve());
		const onError = jest.fn();
		const stream = new PassThrough();
		const step = new LogStep('tacos', { onEnd, onError, verbosity: 4, stream });

		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});
		step.activate();

		step.log('hello');
		await step.end();
		await step.flush();
		await waitStreamEnd(stream);

		expect(out).toEqual(`::group::tacos
 ┌ tacos
 │ [36m[1mLOG[22m[39m hello
 └ [32m✔[39m [2m0ms[22m
::endgroup::
`);
	});

	test('when activated, flushes its logs to the stream', async () => {
		const onEnd = jest.fn(() => Promise.resolve());
		const onError = jest.fn();
		const stream = new PassThrough();
		const step = new LogStep('tacos', { onEnd, onError, verbosity: 3, stream });

		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		step.log('hellooooo');
		step.activate();
		await step.end();
		await step.flush();
		await waitStreamEnd(stream);

		expect(out).toMatchInlineSnapshot(`
		" ┌ tacos
		 │ [36m[1mLOG[22m[39m hellooooo
		 └ [32m✔[39m [2m0ms[22m
		"
	`);
	});

	test.concurrent.each([
		[0, []],
		[1, ['info', 'error']],
		[2, ['info', 'error', 'warn']],
		[3, ['info', 'error', 'warn', 'log']],
		[4, ['info', 'error', 'warn', 'log', 'debug']],
		[5, ['info', 'error', 'warn', 'log', 'debug', 'timing']],
	] as Array<[number, Array<keyof LogStep>]>)('verbosity = %d writes %j', async (verbosity, methods) => {
		const onEnd = jest.fn(() => Promise.resolve());
		const onError = jest.fn();
		const stream = new PassThrough();
		const step = new LogStep('tacos', { onEnd, onError, verbosity, stream });

		const logs = {
			info: `${pc.blue(pc.bold('INFO'))} some information`,
			error: ` │ ${pc.red(pc.bold('ERR'))} an error`,
			warn: ` │ ${pc.yellow(pc.bold('WRN'))} a warning`,
			log: ` │ ${pc.cyan(pc.bold('LOG'))} a log`,
			debug: ` │ ${pc.magenta(pc.bold('DBG'))} a debug`,
			timing: ` │ ${pc.red('⏳')} foo → bar: 0ms`,
		};

		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		step.activate();

		step.info('some information');
		step.error('an error');
		step.warn('a warning');
		step.log('a log');
		step.debug('a debug');
		performance.mark('foo');
		performance.mark('bar');
		step.timing('foo', 'bar');

		await step.end();
		await step.flush();

		// Some funky stuff happening here
		// @ts-ignore
		if (verbosity === 0) {
			stream.end();
		}

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

	test.concurrent.each([
		['function', function foo() {}, ` │ ${pc.cyan(pc.bold('LOG'))} function foo() {`],
		[
			'object',
			{ foo: 'bar' },
			` │ ${pc.cyan(pc.bold('LOG'))} {
 │ ${pc.cyan(pc.bold('LOG'))}   "foo": "bar"
 │ ${pc.cyan(pc.bold('LOG'))} }`,
		],
		[
			'array',
			['foo', true],
			` │ ${pc.cyan(pc.bold('LOG'))} [
 │ ${pc.cyan(pc.bold('LOG'))}   "foo",
 │ ${pc.cyan(pc.bold('LOG'))}   true
 │ ${pc.cyan(pc.bold('LOG'))} ]`,
		],
		['date', new Date('2023-03-11'), ` │ ${pc.cyan(pc.bold('LOG'))} 2023-03-11T00:00:00.000Z`],
	])('can stringify %s', async (name, obj, exp) => {
		const onEnd = jest.fn(() => Promise.resolve());
		const onError = jest.fn();
		const stream = new PassThrough();
		const step = new LogStep('tacos', { onEnd, onError, verbosity: 3, stream });

		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		step.log(obj);
		step.activate();
		await step.end();
		await step.flush();
		await waitStreamEnd(stream);

		expect(out).toMatch(exp);
	});
});
