import { performance } from 'node:perf_hooks';
import * as onerepo from 'onerepo';
import { performanceWriter } from '../index.ts';

async function tick() {
	return new Promise<void>((resolve) => {
		setImmediate(() => {
			resolve();
		});
	});
}

const argv = {
	$0: 'test-runner',
	_: [],
	'--': [],
	'dry-run': false,
	quiet: false,
	verbosity: 2,
	'skip-engine-check': false,
};

describe('measure', () => {
	beforeEach(() => {
		performance.clearMarks();
		performance.clearMeasures();
	});

	test('measures between onerepo_start_ and onerepo_end_', async () => {
		const { startup, shutdown } = performanceWriter();

		startup!(
			argv,
			// @ts-ignore
			{},
		);

		performance.mark('onerepo_start_Tacos');
		performance.mark('onerepo_end_Tacos');

		await tick();
		await shutdown!(argv);

		expect(performance.getEntriesByType('measure')).toEqual([
			expect.objectContaining({
				duration: expect.any(Number),
				entryType: 'measure',
				name: 'Tacos',
				startTime: expect.any(Number),
			}),
		]);
	});

	test('merges details', async () => {
		const { startup, shutdown } = performanceWriter();
		startup!(
			argv,
			// @ts-ignore
			{},
		);

		performance.mark('onerepo_start_Tacos', { detail: { foo: 'foo' } });
		performance.mark('onerepo_end_Tacos', { detail: { bar: 'bar' } });

		await tick();
		await shutdown!(argv);

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', { argv, foo: 'foo', bar: 'bar' });
	});

	test('passes argv from measure into detail', async () => {
		const { startup, shutdown } = performanceWriter();
		startup!(
			argv,
			// @ts-ignore
			{},
		);

		performance.mark('onerepo_start_Tacos', { detail: { foo: 'foo' } });
		performance.mark('onerepo_end_Tacos', { detail: { bar: 'bar' } });

		await tick();
		await shutdown!(argv);

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', {
			argv,
			foo: 'foo',
			bar: 'bar',
		});
	});

	test('converts string detail into description', async () => {
		const { startup, shutdown } = performanceWriter();
		startup!(
			argv,
			// @ts-ignore
			{},
		);

		performance.mark('onerepo_start_Tacos', { detail: 'from start' });
		performance.mark('onerepo_end_Tacos', {});

		await tick();
		await shutdown!(argv);

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', {
			argv,
			description: 'from start',
		});
	});

	test('merges string details into description', async () => {
		const { startup, shutdown } = performanceWriter();
		startup!(
			argv,
			// @ts-ignore
			{},
		);

		performance.mark('onerepo_start_Tacos', { detail: 'from start' });
		performance.mark('onerepo_end_Tacos', { detail: 'from end' });

		await tick();
		await shutdown!(argv);

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', {
			argv,
			description: 'from start from end',
		});
	});

	test('ignores marks that are not onerepo_start_', async () => {
		performance.mark('foo');
		performance.mark('bar');
		const { startup, shutdown } = performanceWriter();
		startup!(
			argv,
			// @ts-ignore
			{},
		);
		await shutdown!(argv);

		expect(performance.getEntriesByType('measure')).toEqual([]);
	});

	test('does not create measure if no onerepo_end_ mark', async () => {
		performance.mark('onerepo_start_Tacos');
		const { startup, shutdown } = performanceWriter();
		startup!(
			argv,
			// @ts-ignore
			{},
		);
		await shutdown!(argv);

		expect(performance.getEntriesByType('measure')).toEqual([]);
	});

	test('can write to a file with a filepath', async () => {
		vi.spyOn(onerepo.file, 'write').mockResolvedValue();
		const { startup, shutdown } = performanceWriter({ output: '/foo' });
		startup!(
			argv,
			// @ts-ignore
			{},
		);
		await shutdown!(argv);

		expect(onerepo.file.write).toHaveBeenCalledWith('/foo', '[]', { step: expect.any(Object) });
	});

	test('can write to a generated temporary file', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(123);
		vi.spyOn(onerepo.file, 'write').mockResolvedValue();
		vi.spyOn(onerepo.file, 'makeTempDir').mockResolvedValue('/tmp/foo/onerepo-perf');
		const { startup, shutdown } = performanceWriter();
		startup!(
			argv,
			// @ts-ignore
			{},
		);
		await shutdown!(argv);

		expect(onerepo.file.makeTempDir).toHaveBeenCalledWith('onerepo-perf', { step: expect.any(Object) });
		expect(onerepo.file.write).toHaveBeenCalledWith('/tmp/foo/onerepo-perf/123.json', '[]', {
			step: expect.any(Object),
		});
	});
});
