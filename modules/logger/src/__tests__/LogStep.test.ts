import { PassThrough } from 'node:stream';
import pc from 'picocolors';
import { LogStep } from '../LogStep';

describe('LogStep', () => {
	let runId: string | undefined;

	beforeEach(() => {
		runId = process.env.GITHUB_RUN_ID;
		delete process.env.GITHUB_RUN_ID;
	});

	afterEach(() => {
		process.env.GITHUB_RUN_ID = runId;
	});

	test('setup', async () => {
		const onEnd = vi.fn();
		const step = new LogStep('tacos', { onEnd, verbosity: 3, onMessage: () => {} });

		expect(step.name).toBe('tacos');
		expect(step.verbosity).toBe(3);
		expect(step.active).toBe(false);
		expect(step.status).toEqual([' ┌ tacos']);
	});

	test('can be activated', async () => {
		const onEnd = vi.fn();
		const step = new LogStep('tacos', { onEnd, verbosity: 3, onMessage: () => {} });
		step.activate();

		expect(step.active).toBe(true);
	});

	test('writes group & endgroup when GITHUB_RUN_ID is set', async () => {
		process.env.GITHUB_RUN_ID = 'yes';
		const onEnd = vi.fn(() => Promise.resolve());
		const stream = new PassThrough();
		const step = new LogStep('tacos', { onEnd, verbosity: 4, stream, onMessage: () => {} });

		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});
		step.activate();

		step.log('hello');
		await step.end();
		await step.flush();

		expect(out).toMatch(/^::group::tacos\n/);
		expect(out).toMatch(/::endgroup::\n$/);
	});

	test('when activated, flushes its logs to the stream', async () => {
		vi.restoreAllMocks();
		const onEnd = vi.fn(() => Promise.resolve());
		const stream = new PassThrough();
		const step = new LogStep('tacos', { onEnd, verbosity: 3, stream, onMessage: () => {} });

		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		step.log('hellooooo');
		step.activate();
		await step.end();
		await step.flush();

		expect(out).toEqual(
			` ┌ tacos
 │ ${pc.cyan(pc.bold('LOG'))} hellooooo
 └ ${pc.green('✔')} ${pc.dim('0ms')}
`,
		);
	});

	test.concurrent.each([
		[0, []],
		[1, ['info', 'error']],
		[2, ['info', 'error', 'warn']],
		[3, ['info', 'error', 'warn', 'log']],
		[4, ['info', 'error', 'warn', 'log', 'debug']],
		[5, ['info', 'error', 'warn', 'log', 'debug', 'timing']],
	] as Array<[number, Array<keyof LogStep>]>)('verbosity = %d writes %j', async (verbosity, methods) => {
		const onEnd = vi.fn(() => Promise.resolve());
		const stream = new PassThrough();
		const step = new LogStep('tacos', { onEnd, verbosity, stream, onMessage: () => {} });

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
		[
			'function',
			function foo(asdf: unknown) {
				return asdf;
			},
			` │ ${pc.cyan(pc.bold('LOG'))} function foo(asdf) {`,
		],
		[
			'function with zero arguments are executed',
			function foo() {
				return 'tacos';
			},
			` │ ${pc.cyan(pc.bold('LOG'))} tacos`,
		],
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
		const onEnd = vi.fn(() => Promise.resolve());
		const stream = new PassThrough();
		const step = new LogStep('tacos', { onEnd, verbosity: 3, stream, onMessage: () => {} });

		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		step.log(obj);
		step.activate();
		await step.end();
		await step.flush();

		expect(out).toMatch(exp);
	});

	test('can omit prefixes', async () => {
		const onEnd = vi.fn(() => Promise.resolve());
		const stream = new PassThrough();
		const step = new LogStep('tacos', { onEnd, verbosity: 4, stream, writePrefixes: false, onMessage: () => {} });

		let out = '';
		stream.on('data', (chunk) => {
			out += chunk.toString();
		});

		step.error('error');
		step.warn('warn');
		step.info('info');
		step.log('log');
		step.debug('debug');
		step.activate();
		await step.end();
		await step.flush();

		expect(out).toEqual(` ┌ tacos
 │error
 │warn
 │info
 │log
 │debug
 └ ${pc.red('✘')} ${pc.dim('0ms')}
`);
	});

	test('sets hasError/etc when messages are added', async () => {
		const onEnd = vi.fn(() => Promise.resolve());
		const stream = new PassThrough();
		const step = new LogStep('tacos', { onEnd, verbosity: 4, stream, onMessage: () => {} });
		step.activate();

		expect(step.hasError).toBe(false);
		expect(step.hasWarning).toBe(false);
		expect(step.hasInfo).toBe(false);
		expect(step.hasLog).toBe(false);

		step.error('foo');
		expect(step.hasError).toBe(true);

		step.warn('foo');
		expect(step.hasWarning).toBe(true);

		step.info('foo');
		expect(step.hasInfo).toBe(true);

		step.log('foo');
		expect(step.hasLog).toBe(true);

		await step.end();
		await step.flush();
		stream.destroy();
	});

	test('calls onMessage as messages are added', async () => {
		const onMessage = vi.fn();
		const stream = new PassThrough();
		const step = new LogStep('tacos', { onEnd: () => Promise.resolve(), verbosity: 4, stream, onMessage });
		step.activate();

		expect(onMessage).not.toHaveBeenCalled();

		step.error('foo');
		expect(onMessage).toHaveBeenCalledWith('error');

		step.warn('foo');
		expect(onMessage).toHaveBeenCalledWith('warn');

		step.info('foo');
		expect(onMessage).toHaveBeenCalledWith('info');

		step.log('foo');
		expect(onMessage).toHaveBeenCalledWith('log');

		step.debug('foo');
		expect(onMessage).toHaveBeenCalledWith('debug');

		await step.end();
		await step.flush();
		stream.destroy();
	});
});
