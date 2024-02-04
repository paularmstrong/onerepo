import path from 'node:path';
import * as file from '@onerepo/file';
import { getGraph } from '@onerepo/graph';
import { LogStep } from '@onerepo/logger';
import { applyVersions } from '../apply-versions';

const graph = getGraph(path.join(__dirname, '../../__tests__/__fixtures__/with-entries'));

describe('applyVersions', () => {
	beforeEach(() => {
		vi.spyOn(file, 'write').mockResolvedValue();
	});

	test('applies new versions', async () => {
		const lettuce = graph.getByName('lettuce');
		await applyVersions(
			[lettuce],
			graph,
			new Map([
				[
					graph.getByName('lettuce'),
					{
						type: 'minor',
						version: '1.1.0',
						fromRef: 'abc',
						throughRef: '123',
						logs: [],
						entries: [{ type: 'minor', content: '', ref: '123' }],
					},
				],
			]),
		);

		const expected = lettuce.packageJson;
		expected.version = '1.1.0';

		expect(file.write).toHaveBeenCalledWith(lettuce.resolve('package.json'), JSON.stringify(expected, null, 2), {
			step: expect.any(LogStep),
		});
	});

	test('applies versions to dependents', async () => {
		const tacos = graph.getByName('tacos');
		const lettuce = graph.getByName('lettuce');
		await applyVersions(
			[lettuce],
			graph,
			new Map([
				[
					graph.getByName('lettuce'),
					{
						type: 'minor',
						version: '1.1.0',
						fromRef: 'abc',
						throughRef: '123',
						logs: [],
						entries: [{ type: 'minor', content: '', ref: '123' }],
					},
				],
			]),
		);

		const expected = tacos.packageJson;
		expected.dependencies!.lettuce = '1.1.0';

		expect(file.write).toHaveBeenCalledWith(tacos.resolve('package.json'), JSON.stringify(expected, null, 2), {
			step: expect.any(LogStep),
		});
	});

	test('ignores workspace protocol dependents', async () => {
		const tacos = graph.getByName('tacos');
		const cheese = graph.getByName('cheese');
		await applyVersions(
			[cheese],
			graph,
			new Map([
				[
					graph.getByName('cheese'),
					{
						type: 'minor',
						version: '1.1.0',
						fromRef: 'abc',
						throughRef: '123',
						logs: [],
						entries: [{ type: 'minor', content: '', ref: '123' }],
					},
				],
			]),
		);

		const expected = tacos.packageJson;
		expected.dependencies!.lettuce = '1.1.0';

		expect(file.write).not.toHaveBeenCalledWith(tacos.resolve('package.json'), expect.any(String), {
			step: expect.any(LogStep),
		});
	});
});
