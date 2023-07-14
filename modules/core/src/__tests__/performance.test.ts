import { performance } from 'node:perf_hooks';
import * as file from '@onerepo/file';
import { measure } from '../performance';

jest.mock('@onerepo/file', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/file'),
}));

describe('measure', () => {
	beforeEach(() => {
		performance.clearMarks();
		performance.clearMeasures();
	});

	test('measures between onerepo_start_ and onerepo_end_', async () => {
		performance.mark('onerepo_start_Tacos');
		performance.mark('onerepo_end_Tacos');
		await measure(true, {});

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
		await measure(true, {});

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', { argv: {}, foo: 'foo', bar: 'bar' });
	});

	test('passes argv from measure into detail', async () => {
		performance.mark('onerepo_start_Tacos', { detail: { foo: 'foo' } });
		performance.mark('onerepo_end_Tacos', { detail: { bar: 'bar' } });
		await measure(true, { cmd: 'foo' });

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', {
			argv: { cmd: 'foo' },
			foo: 'foo',
			bar: 'bar',
		});
	});

	test('converts string detail into description', async () => {
		performance.mark('onerepo_start_Tacos', { detail: 'from start' });
		performance.mark('onerepo_end_Tacos', {});
		await measure(true, {});

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', {
			argv: {},
			description: 'from start',
		});
	});

	test('merges string details into description', async () => {
		performance.mark('onerepo_start_Tacos', { detail: 'from start' });
		performance.mark('onerepo_end_Tacos', { detail: 'from end' });
		await measure(true, {});

		expect(performance.getEntriesByType('measure')[0]).toHaveProperty('detail', {
			argv: {},
			description: 'from start from end',
		});
	});

	test('ignores marks that are not onerepo_start_', async () => {
		performance.mark('foo');
		performance.mark('bar');
		await measure(true, {});

		expect(performance.getEntriesByType('measure')).toEqual([]);
	});

	test('does not create measure if no onerepo_end_ mark', async () => {
		performance.mark('onerepo_start_Tacos');
		await measure(true, {});

		expect(performance.getEntriesByType('measure')).toEqual([]);
	});

	test('can write to a file with a filepath', async () => {
		jest.spyOn(file, 'write').mockResolvedValue();
		await expect(measure('/foo', {})).resolves.toEqual('/foo');

		expect(file.write).toHaveBeenCalledWith('/foo', '[]', { step: expect.any(Object) });
	});

	test('can write to a generated temporary file', async () => {
		jest.spyOn(Date, 'now').mockReturnValue(123);
		jest.spyOn(file, 'write').mockResolvedValue();
		jest.spyOn(file, 'makeTempDir').mockResolvedValue('/tmp/foo/onerepo-perf');
		await expect(measure('temp', {})).resolves.toEqual('/tmp/foo/onerepo-perf/123.json');

		expect(file.makeTempDir).toHaveBeenCalledWith('onerepo-perf', { step: expect.any(Object) });
		expect(file.write).toHaveBeenCalledWith('/tmp/foo/onerepo-perf/123.json', '[]', { step: expect.any(Object) });
	});
});
