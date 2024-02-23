import * as core from '@actions/core';
import * as onerepo from 'onerepo';
import { getCommand } from '@onerepo/test-cli';
import * as Prettier from '../prettier';

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
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--all');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'prettier',
				args: ['--ignore-unknown', '--write', '--cache', '--cache-strategy', 'content', '.'],
			}),
		);
	});

	test('can run across individual workspaces', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(onerepo.file, 'exists').mockResolvedValue(false);
		vi.spyOn(onerepo.file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => true },
		);

		await expect(run('-w burritos -w tacos')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'prettier',
				args: [
					'--ignore-unknown',
					'--write',
					'--cache',
					'--cache-strategy',
					'content',
					'modules/burritos',
					'modules/tacos',
				],
			}),
		);
	});

	test('does not write in dry-run', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await expect(run('-a --dry-run')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'prettier',
				args: ['--ignore-unknown', '--list-different', '--cache', '--cache-strategy', 'content', '.'],
			}),
		);
	});

	test('filters with .prettierignore', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(onerepo.file, 'exists').mockResolvedValue(true);
		vi.spyOn(onerepo.file, 'read').mockResolvedValue(`
# ignore the comment
bar/**/*
`);
		vi.spyOn(onerepo.file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => false },
		);
		await expect(run('-f foo.js -f bar/baz/bop.js')).resolves.toBeTruthy();

		expect(onerepo.file.exists).toHaveBeenCalledWith(expect.stringMatching(/\.prettierignore$/), expect.any(Object));

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'prettier',
				args: ['--ignore-unknown', '--write', '--cache', '--cache-strategy', 'content', 'foo.js'],
			}),
		);
	});

	test('updates the git index for filtered paths with --add', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(onerepo.file, 'exists').mockResolvedValue(true);
		vi.spyOn(onerepo.file, 'read').mockResolvedValue(`
# ignore the comment
*.xd
`);
		vi.spyOn(onerepo.file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => false },
		);

		vi.spyOn(onerepo.git, 'updateIndex').mockResolvedValue('');

		await expect(run('-f foo.xd -f bar.js --add')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'prettier',
				args: ['--ignore-unknown', '--write', '--cache', '--cache-strategy', 'content', 'bar.js'],
			}),
		);
		expect(onerepo.git.updateIndex).toHaveBeenCalledWith(['bar.js']);
	});

	test('annotates github for file errors', async () => {
		process.env.GITHUB_RUN_ID = '123';
		vi.spyOn(core, 'error').mockReturnValue();
		vi.spyOn(graph.packageManager, 'run').mockImplementation(() => {
			throw new Error('foo.js\nbop.js\n');
		});

		await expect(run('-f foo.js -f bop.js -f bar.js')).rejects.toMatch(
			'The following files were not properly formatted',
		);

		expect(core.error).toHaveBeenCalledWith(expect.stringContaining('This file needs formatting'), { file: 'foo.js' });
		expect(core.error).toHaveBeenCalledWith(expect.stringContaining('This file needs formatting'), { file: 'bop.js' });
		expect(core.error).not.toHaveBeenCalledWith(expect.any(String), { file: 'bar.js' });
	});

	test('can disable cache', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--all --no-cache');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'prettier',
				args: ['--ignore-unknown', '--write', '.'],
			}),
		);
	});
});
