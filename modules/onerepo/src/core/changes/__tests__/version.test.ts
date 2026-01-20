import path from 'node:path';
import inquirer from 'inquirer';
import { getCommand } from '@onerepo/test-cli';
import { getGraph } from '@onerepo/graph';
import * as version from '../version.ts';
import * as utils from '../utils/index.ts';

const graph = await getGraph(path.join(__dirname, '__fixtures__/with-entries'));
const { run } = await getCommand(version, graph);
const tacos = graph.getByName('tacos');
const lettuce = graph.getByName('lettuce');

describe('version', () => {
	beforeEach(() => {
		vi.spyOn(utils, 'applyVersions').mockResolvedValue();
		vi.spyOn(utils, 'consumeChangelogs').mockResolvedValue();
		vi.spyOn(graph.packageManager, 'install').mockResolvedValue('yarn.lock');
	});

	test('confirms repo clean state', async () => {
		vi.spyOn(utils, 'confirmClean').mockResolvedValue(false);
		vi.spyOn(utils, 'applyVersions');
		await expect(run()).resolves.toBeTruthy();

		expect(utils.applyVersions).not.toHaveBeenCalled();
	});

	test('can bypass the clean check', async () => {
		vi.spyOn(utils, 'confirmClean').mockResolvedValue(true);
		vi.spyOn(utils, 'getVersionable').mockResolvedValue(
			new Map([[tacos, { type: 'minor', version: '1.1.0', entries: [], logs: [], fromRef: 'abc', throughRef: '123' }]]),
		);
		vi.spyOn(utils, 'requestVersioned').mockResolvedValue([tacos]);
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ okay: true });
		await expect(run('--allow-dirty')).resolves.toBeTruthy();

		expect(utils.confirmClean).not.toHaveBeenCalled();
		expect(utils.applyVersions).toHaveBeenCalled();
	});

	test('can get workspaces from inputs', async () => {
		vi.spyOn(utils, 'confirmClean').mockResolvedValue(true);
		const versionPlan = new Map([
			[
				lettuce,
				{
					type: 'minor' as const,
					version: '1.1.0',
					entries: [],
					logs: [{ ref: '123', subject: 'yep' }],
					fromRef: 'abc',
					throughRef: '123',
				},
			],
		]);
		vi.spyOn(utils, 'getVersionable').mockResolvedValue(versionPlan);
		vi.spyOn(utils, 'requestVersioned').mockResolvedValue([tacos]);
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ okay: true });

		await expect(run('-w lettuce')).resolves.toBeTruthy();

		expect(utils.applyVersions).toHaveBeenCalledWith([lettuce], graph, versionPlan);
		expect(graph.packageManager.install).toHaveBeenCalled();
	});

	test.todo('writes changelogs', async () => {});
});
