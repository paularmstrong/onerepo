import path from 'node:path';
import * as subprocess from '@onerepo/subprocess';
import * as file from '@onerepo/file';
import inquirer from 'inquirer';
import { getGraph } from '@onerepo/graph';
import { getCommand } from '@onerepo/test-cli';
import { LogStep } from '@onerepo/logger';
import * as Add from '../add';

const { run } = getCommand(Add);

describe('add', () => {
	beforeEach(() => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		vi.spyOn(file, 'write').mockResolvedValue();
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({});
	});

	test('can install a dependency', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		vi.spyOn(graph.packageManager, 'install');
		vi.spyOn(graph.packageManager, 'info').mockResolvedValue(
			// @ts-ignore
			{ 'dist-tags': { latest: '3.4.0 ' }, versions: ['3.5.0', '3.4.0'] },
		);
		const tacos = graph.getByName('fixture-tacos');

		await expect(run('-w fixture-tacos -d normalizr@3.4.0 --mode strict', { graph })).resolves.toBeTruthy();

		expect(graph.packageManager.install).toHaveBeenCalled();
		expect(file.write).toHaveBeenCalledWith(
			tacos.resolve('package.json'),
			JSON.stringify({ ...tacos.packageJson, devDependencies: { normalizr: '3.4.0' } }, null, 2),
			{ step: expect.any(LogStep) },
		);
	});

	test('lets you choose', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({ lettuce: '^1.5.6' });
		vi.spyOn(graph.packageManager, 'install');
		vi.spyOn(graph.packageManager, 'info').mockResolvedValue(
			// @ts-ignore
			{ 'dist-tags': { latest: '3.4.0 ' }, versions: ['3.5.0', '3.4.0'] },
		);
		const ws = graph.getByName('menu');

		await expect(run('-w menu -d lettuce --mode loose', { graph })).resolves.toBeTruthy();

		expect(graph.packageManager.install).toHaveBeenCalled();
		expect(inquirer.prompt).toHaveBeenCalledWith([expect.objectContaining({ type: 'list', name: 'lettuce' })]);
		expect(file.write).toHaveBeenCalledWith(
			ws.resolve('package.json'),
			JSON.stringify({ ...ws.packageJson, devDependencies: { lettuce: '^1.5.6' } }, null, 2),
			{ step: expect.any(LogStep) },
		);
	});

	test('does not get all workspaces when installing in root workspace', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		vi.spyOn(graph.packageManager, 'install');
		vi.spyOn(graph.packageManager, 'info').mockResolvedValue(
			// @ts-ignore
			{ 'dist-tags': { latest: '3.4.0 ' }, versions: ['3.5.0', '3.4.0'] },
		);
		const root = graph.getByName('fixture-root');

		await expect(run('-w fixture-root -d normalizr@3.4.0 --mode strict', { graph })).resolves.toBeTruthy();

		expect(graph.packageManager.install).toHaveBeenCalled();
		expect(file.write).toHaveBeenCalledWith(
			root.resolve('package.json'),
			JSON.stringify({ ...root.packageJson, dependencies: {}, devDependencies: { normalizr: '3.4.0' } }, null, 2),
			{ step: expect.any(LogStep) },
		);

		expect(file.write).toHaveBeenCalledTimes(1);
	});

	test('can cancel if trying to add prod deps to root workspace', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		vi.spyOn(graph.packageManager, 'install');
		vi.spyOn(graph.packageManager, 'info').mockResolvedValue(
			// @ts-ignore
			{ 'dist-tags': { latest: '3.4.0 ' }, versions: ['3.5.0', '3.4.0'] },
		);
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ confirm: false });

		await expect(run('-w fixture-root -p normalizr@3.4.0 --mode strict', { graph })).rejects.toMatch(
			'Root Workspaces may not include production-level dependencies.',
		);

		expect(file.write).not.toHaveBeenCalled();
	});

	test('can fix prod deps to dev when adding to root workspace', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		vi.spyOn(graph.packageManager, 'install');
		vi.spyOn(graph.packageManager, 'info').mockResolvedValue(
			// @ts-ignore
			{ 'dist-tags': { latest: '3.4.0 ' }, versions: ['3.5.0', '3.4.0'] },
		);
		vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({ confirm: true });

		await expect(run('-w fixture-root -p normalizr@3.4.0 --mode strict', { graph })).resolves.toBeTruthy();

		const root = graph.getByName('fixture-root');

		expect(graph.packageManager.install).toHaveBeenCalled();
		expect(file.write).toHaveBeenCalledWith(
			root.resolve('package.json'),
			JSON.stringify({ ...root.packageJson, dependencies: {}, devDependencies: { normalizr: '3.4.0' } }, null, 2),
			{ step: expect.any(LogStep) },
		);

		expect(file.write).toHaveBeenCalledTimes(1);
	});
});
