import { PassThrough } from 'node:stream';
import { LogStep } from '../LogStep';
import type { Verbosity } from '../types';

const parser = (out: Array<unknown>) => {
	const stream = new PassThrough();
	stream.on('data', (chunk) => {
		out.push(JSON.parse(chunk.toString()));
	});
	return stream;
};

const waitAtick = () =>
	new Promise<void>((resolve) => {
		setImmediate(() => {
			setImmediate(() => {
				resolve();
			});
		});
	});

describe('LogStep', () => {
	test('setup', async () => {
		const step = new LogStep({ name: 'tacos', verbosity: 3 });

		expect(step.name).toBe('tacos');
		expect(step.isPiped).toBe(false);
	});

	test('can be piped', async () => {
		const out: Array<unknown> = [];
		const step = new LogStep({ name: 'tacos', verbosity: 3 });
		const stream = parser(out);
		step.pipe(stream);
		step.end();

		await waitAtick();

		expect(out).toEqual([
			{ type: 'start', contents: 'tacos', group: 'tacos', verbosity: 3 },
			{ type: 'end', contents: expect.stringContaining('ms'), group: 'tacos', hasError: false, verbosity: 3 },
		]);
	});

	test.concurrent.each([
		[0, []],
		[1, ['info', 'error']],
		[2, ['info', 'error', 'warn']],
		[3, ['info', 'error', 'warn', 'log']],
		[4, ['info', 'error', 'warn', 'log', 'debug']],
		[5, ['info', 'error', 'warn', 'log', 'debug', 'timing']],
	] as Array<[Verbosity, Array<keyof LogStep>]>)('verbosity = %d writes %j', async (verbosity, methods) => {
		const logs = {
			info: { type: 'info', contents: 'some information', verbosity, group: 'tacos' },
			error: { type: 'error', contents: 'an error', verbosity, group: 'tacos' },
			warn: { type: 'warn', contents: 'a warning', verbosity, group: 'tacos' },
			log: { type: 'log', contents: 'a log', verbosity, group: 'tacos' },
			debug: { type: 'debug', contents: 'a debug', verbosity, group: 'tacos' },
			timing: { type: 'timing', contents: 'foo → bar: 0ms', verbosity, group: 'tacos' },
		};

		const out: Array<unknown> = [];
		const stream = parser(out);
		const step = new LogStep({ name: 'tacos', verbosity });
		step.pipe(stream);

		step.info('some information');
		step.error('an error');
		step.warn('a warning');
		step.log('a log');
		step.debug('a debug');
		performance.mark('foo');
		performance.mark('bar');
		step.timing('foo', 'bar');

		step.end();

		await waitAtick();

		for (const [method, str] of Object.entries(logs)) {
			// @ts-ignore
			if (!methods.includes(method)) {
				expect(out).not.toEqual(expect.arrayContaining(['asdf']));
			} else {
				expect(out).toEqual(expect.arrayContaining([str]));
			}
		}
	});

	test.concurrent.each([
		[
			'function',
			function foo(asdf: unknown) {
				return asdf;
			},
			[{ type: 'log', contents: expect.stringContaining('function foo(asdf) {'), verbosity: 3, group: 'tacos' }],
		],
		[
			'function with zero arguments are executed',
			function foo() {
				return 'tacos';
			},
			[{ type: 'log', contents: 'tacos', verbosity: 3, group: 'tacos' }],
		],
		[
			'object',
			{ foo: 'bar' },
			[{ type: 'log', contents: JSON.stringify({ foo: 'bar' }, null, 2), verbosity: 3, group: 'tacos' }],
		],
		[
			'array',
			['foo', true],
			[{ type: 'log', contents: JSON.stringify(['foo', true], null, 2), verbosity: 3, group: 'tacos' }],
		],
		[
			'date',
			new Date('2023-03-11'),
			[{ type: 'log', contents: '2023-03-11T00:00:00.000Z', verbosity: 3, group: 'tacos' }],
		],
	])('can stringify %s', async (name, obj, exp) => {
		const out: Array<unknown> = [];
		const stream = parser(out);
		const step = new LogStep({ name: 'tacos', verbosity: 3 });
		step.pipe(stream);

		step.log(obj);
		step.end();

		await waitAtick();

		expect(out).toEqual(expect.arrayContaining(exp));
	});

	test('sets hasError/etc when messages are added', async () => {
		const out: Array<unknown> = [];
		const stream = parser(out);
		const step = new LogStep({ name: 'tacos', verbosity: 4 });
		step.pipe(stream);

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

		step.end();
		stream.destroy();
	});
});
