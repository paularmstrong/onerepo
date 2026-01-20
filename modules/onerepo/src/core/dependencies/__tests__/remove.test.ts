import path from 'node:path';
import * as subprocess from '@onerepo/subprocess';
import * as file from '@onerepo/file';
import { getGraph } from '@onerepo/graph';
import { getCommand } from '@onerepo/test-cli';
import { LogStep } from '@onerepo/logger';
import * as Remove from '../remove.ts';

const { run } = await getCommand(Remove);

describe('remove', () => {
	beforeEach(() => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		vi.spyOn(file, 'write').mockResolvedValue();
	});

	test('can remove dependency from one workspace', async () => {
		const graph = await getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const install = vi.spyOn(graph.packageManager, 'install');

		await expect(run('-w fixture-tacos -d tortillas', { graph })).resolves.toBeTruthy();

		expect(file.write).toHaveBeenCalledWith(
			graph.getByName('fixture-tacos').resolve('package.json'),
			JSON.stringify(
				{
					...graph.getByName('fixture-tacos').packageJson,
					dependencies: {
						lettuce: '^1.5.6',
					},
				},
				null,
				2,
			),
			{ step: expect.any(LogStep) },
		);

		expect(install).toHaveBeenCalled();
	});

	test('can remove dependency from all workspaces', async () => {
		const graph = await getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await expect(run('-a -d tortillas', { graph })).resolves.toBeTruthy();

		expect(file.write).toHaveBeenCalledWith(
			graph.getByName('fixture-tacos').resolve('package.json'),
			JSON.stringify(
				{
					...graph.getByName('fixture-tacos').packageJson,
					dependencies: {
						lettuce: '^1.5.6',
					},
				},
				null,
				2,
			),
			{ step: expect.any(LogStep) },
		);
		expect(file.write).toHaveBeenCalledWith(
			graph.getByName('menu').resolve('package.json'),
			JSON.stringify(
				{
					...graph.getByName('menu').packageJson,
					dependencies: {
						'fixture-burritos': 'workspace:^',
						'fixture-tacos': 'workspace:^',
					},
				},
				null,
				2,
			),
			{ step: expect.any(LogStep) },
		);
	});

	test('dedupes', async () => {
		const graph = await getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const install = vi.spyOn(graph.packageManager, 'install');
		const dedupe = vi.spyOn(graph.packageManager, 'dedupe');

		await expect(run('-a -d tortillas --dedupe', { graph })).resolves.toBeTruthy();

		expect(install).toHaveBeenCalled();
		expect(dedupe).toHaveBeenCalled();
	});
});
