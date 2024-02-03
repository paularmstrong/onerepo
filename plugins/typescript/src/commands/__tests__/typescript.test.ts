import { constants } from 'node:fs';
import { getCommand } from '@onerepo/test-cli';
import * as file from '@onerepo/file';
import { LogStep } from 'onerepo';
import * as command from '../typescript';

const { graph, run } = getCommand(command);

describe('handler', () => {
	test('includes --pretty', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(graph.packageManager, 'batch').mockResolvedValue([['', '']]);
		await run('-a');

		expect(graph.packageManager.batch).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'tsc',
					args: ['-p', expect.stringMatching('tsconfig.json'), '--noEmit', '--pretty'],
				}),
			]),
		);
	});

	test('can turn off --pretty', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(graph.packageManager, 'batch').mockResolvedValue([['', '']]);
		await run('-a --no-pretty');

		expect(graph.packageManager.batch).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'tsc',
					args: ['-p', expect.stringMatching('tsconfig.json'), '--noEmit', '--no-pretty'],
				}),
			]),
		);
	});

	test('can opt-in to using project references', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(graph.packageManager, 'batch').mockResolvedValue([['', '']]);
		vi.spyOn(file, 'readJson').mockResolvedValue({});
		vi.spyOn(file, 'write').mockResolvedValue();

		await run('-a --use-project-references');

		expect(file.readJson).toHaveBeenCalledWith(graph.root.resolve('tsconfig.json'), constants.O_RDWR, {
			jsonc: true,
			step: expect.any(LogStep),
		});

		expect(file.write).toHaveBeenCalledWith(
			graph.root.resolve('tsconfig.json'),
			JSON.stringify(
				{
					references: [
						{ path: graph.root.relative(graph.getByName('burritos').location) },
						{ path: graph.root.relative(graph.getByName('tacos').location) },
					],
				},
				null,
				2,
			),
			{ step: expect.any(LogStep) },
		);

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'tsc',
				args: [
					'--build',
					graph.getByName('tacos').resolve('tsconfig.json'),
					graph.getByName('burritos').resolve('tsconfig.json'),
					graph.root.resolve('tsconfig.json'),
					'--pretty',
					'--emitDeclarationOnly',
				],
			}),
		);
	});

	test('does not include verbose flag in non-build mode', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(graph.packageManager, 'batch').mockResolvedValue([['', '']]);
		await run('-a -vvvvv');

		expect(graph.packageManager.batch).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'tsc',
					args: expect.not.arrayContaining(['--verbose']),
				}),
			]),
		);
	});

	test('includes verbose flag in in build mode (project references)', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(graph.packageManager, 'batch').mockResolvedValue([['', '']]);
		vi.spyOn(file, 'readJson').mockResolvedValue({});
		vi.spyOn(file, 'write').mockResolvedValue();

		await run('-a --use-project-references -vvvv');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'tsc',
				args: expect.arrayContaining(['--verbose']),
			}),
		);
	});
});
