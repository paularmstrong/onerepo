import { performance } from 'node:perf_hooks';
import { measure } from '../performance';

describe('measure', () => {
	beforeEach(() => {
		performance.clearMarks();
		performance.clearMeasures();
	});

	test('measures between onerepo_start_ and onerepo_end_', async () => {
		performance.mark('onerepo_start_Tacos');
		performance.mark('onerepo_end_Tacos');
		measure({});

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
		performance.mark('onerepo_start_Tacos', { detail: { foo: 'foo' } });
		performance.mark('onerepo_end_Tacos', { detail: { bar: 'bar' } });
		measure({});

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', { argv: {}, foo: 'foo', bar: 'bar' });
	});

	test('passes argv from measure into detail', async () => {
		performance.mark('onerepo_start_Tacos', { detail: { foo: 'foo' } });
		performance.mark('onerepo_end_Tacos', { detail: { bar: 'bar' } });
		measure({ cmd: 'foo' });

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', {
			argv: { cmd: 'foo' },
			foo: 'foo',
			bar: 'bar',
		});
	});

	test('converts string detail into description', async () => {
		performance.mark('onerepo_start_Tacos', { detail: 'from start' });
		performance.mark('onerepo_end_Tacos', {});
		measure({});

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', {
			argv: {},
			description: 'from start',
		});
	});

	test('merges string details into description', async () => {
		performance.mark('onerepo_start_Tacos', { detail: 'from start' });
		performance.mark('onerepo_end_Tacos', { detail: 'from end' });
		measure({});

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', {
			argv: {},
			description: 'from start from end',
		});
	});

	test('ignores marks that are not onerepo_start_', async () => {
		performance.mark('foo');
		performance.mark('bar');
		measure({});

		expect(performance.getEntriesByType('measure')).toEqual([]);
	});

	test('does not create measure if no onerepo_end_ mark', async () => {
		performance.mark('onerepo_start_Tacos');
		measure({});

		expect(performance.getEntriesByType('measure')).toEqual([]);
	});
});
