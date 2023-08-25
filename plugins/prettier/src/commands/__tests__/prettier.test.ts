import * as core from '@actions/core';
import * as file from '@onerepo/file';
import * as git from '@onerepo/git';
import { getCommand } from '@onerepo/test-cli';
import * as Prettier from '../prettier';

jest.mock('@onerepo/git');
jest.mock('@onerepo/file', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/file'),
}));

const { build, graph, run } = getCommand(Prettier);

describe('builder', () => {
	test('sets --staged to true when --add is true', async () => {
		const args = await build('--add');
		expect(args).toHaveProperty('add', true);
		expect(args).toHaveProperty('staged', true);
	});

	test('does not set --staged to true when --add is not true', async () => {
		const argsEmpty = await build('');
		expect(argsEmpty).not.toHaveProperty('staged');

		const argsNoAdd = await build('--no-add');
		expect(argsNoAdd).not.toHaveProperty('staged');
	});

	test('does not overwrite --no-staged', async () => {
		const args = await build('--add --no-staged');
		expect(args).toHaveProperty('add', true);
		expect(args).toHaveProperty('staged', false);
	});
});

describe('handler', () => {
	let GITHUB_RUN_ID: string | undefined;

	beforeEach(() => {
		GITHUB_RUN_ID = process.env.GITHUB_RUN_ID;
		delete process.env.GITHUB_RUN_ID;
	});

	afterEach(() => {
		process.env.GITHUB_RUN_ID = GITHUB_RUN_ID;
	});

	test('can run across all files', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--all');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'prettier',
				args: ['--ignore-unknown', '--write', '.'],
			}),
		);
	});

	test('can run across individual workspaces', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		jest.spyOn(file, 'exists').mockResolvedValue(false);
		jest.spyOn(file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => true },
		);

		await expect(run('-w burritos -w tacos')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'prettier',
				args: ['--ignore-unknown', '--write', 'modules/burritos', 'modules/tacos'],
			}),
		);
	});

	test('does not write in dry-run', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await expect(run('-a --dry-run')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'prettier',
				args: ['--ignore-unknown', '--list-different', '.'],
			}),
		);
	});

	test('filters with .prettierignore', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		jest.spyOn(file, 'exists').mockResolvedValue(true);
		jest.spyOn(file, 'read').mockResolvedValue(`
# ignore the comment
bar/**/*
`);
		jest.spyOn(file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => false },
		);
		await expect(run('-f foo.js -f bar/baz/bop.js')).resolves.toBeTruthy();

		expect(file.exists).toHaveBeenCalledWith(expect.stringMatching(/\.prettierignore$/), expect.any(Object));

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'prettier',
				args: ['--ignore-unknown', '--write', 'foo.js'],
			}),
		);
	});

	test('updates the git index for filtered paths with --add', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		jest.spyOn(file, 'exists').mockResolvedValue(true);
		jest.spyOn(file, 'read').mockResolvedValue(`
# ignore the comment
*.xd
`);
		jest.spyOn(file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => false },
		);

		jest.spyOn(git, 'updateIndex').mockResolvedValue('');

		await expect(run('-f foo.xd -f bar.js --add')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'prettier',
				args: ['--ignore-unknown', '--write', 'bar.js'],
			}),
		);
		expect(git.updateIndex).toHaveBeenCalledWith(['bar.js']);
	});

	test('annotates github for file errors', async () => {
		process.env.GITHUB_RUN_ID = '123';
		jest.spyOn(core, 'error').mockReturnValue();
		jest.spyOn(graph.packageManager, 'run').mockImplementation(() => {
			throw new Error('foo.js\nbop.js\n');
		});

		await expect(run('-f foo.js -f bop.js -f bar.js')).rejects.toMatch(
			'The following files were not properly formatted',
		);

		expect(core.error).toHaveBeenCalledWith(expect.stringContaining('This file needs formatting'), { file: 'foo.js' });
		expect(core.error).toHaveBeenCalledWith(expect.stringContaining('This file needs formatting'), { file: 'bop.js' });
		expect(core.error).not.toHaveBeenCalledWith(expect.any(String), { file: 'bar.js' });
	});
});
