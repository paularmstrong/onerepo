import * as subprocess from '@onerepo/subprocess';
import * as file from '@onerepo/file';
import * as git from '@onerepo/git';
import * as Eslint from './eslint';
import { getCommand } from '@onerepo/test-cli';

jest.mock('@onerepo/git');
jest.mock('@onerepo/subprocess');
jest.mock('@onerepo/file', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/file'),
}));

const { run } = getCommand(Eslint);

describe('handler', () => {
	test('can run across all files', async () => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);

		await run('--all');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: ['eslint', '--ext', 'js,cjs,mjs', '--cache', '--cache-strategy=content', '--fix', '.'],
			})
		);
	});

	test('can run across individual workspaces', async () => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		jest.spyOn(file, 'exists').mockResolvedValue(false);
		jest.spyOn(file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => true }
		);

		await expect(run('-w burritos -w tacos')).resolves.toBeUndefined();

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: [
					'eslint',
					'--ext',
					'js,cjs,mjs',
					'--cache',
					'--cache-strategy=content',
					'--fix',
					'modules/burritos',
					'modules/tacos',
				],
			})
		);
	});

	test('does not fix in dry-run', async () => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);

		await expect(run('-a --dry-run')).resolves.toBeUndefined();

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: ['eslint', '--ext', 'js,cjs,mjs', '--cache', '--cache-strategy=content', '.'],
			})
		);
	});

	test('does not fix in no-cache', async () => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);

		await expect(run('-a --no-cache')).resolves.toBeUndefined();

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: ['eslint', '--ext', 'js,cjs,mjs', '--fix', '.'],
			})
		);
	});

	test('filters unapproved extensions', async () => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);

		await expect(run('-f foo.xd -f bar.js')).resolves.toBeUndefined();

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: ['eslint', '--ext', 'js,cjs,mjs', '--cache', '--cache-strategy=content', '--fix', 'bar.js'],
			})
		);
	});

	test('filters with .eslintignore', async () => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		jest.spyOn(file, 'exists').mockResolvedValue(true);
		jest.spyOn(file, 'read').mockResolvedValue(`
# ignore the comment
bar/**/*
`);
		jest.spyOn(file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => false }
		);
		await expect(run('-f foo.js -f bar/baz/bop.js')).resolves.toBeUndefined();

		expect(file.exists).toHaveBeenCalledWith(expect.stringMatching(/\.eslintignore$/), expect.any(Object));

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: ['eslint', '--ext', 'js,cjs,mjs', '--cache', '--cache-strategy=content', '--fix', 'foo.js'],
			})
		);
	});

	test('updates the git index for filtered paths with --add', async () => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		jest.spyOn(git, 'updateIndex').mockResolvedValue('');

		await expect(run('-f foo.xd -f bar.js --add')).resolves.toBeUndefined();

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: ['eslint', '--ext', 'js,cjs,mjs', '--cache', '--cache-strategy=content', '--fix', 'bar.js'],
			})
		);
		expect(git.updateIndex).toHaveBeenCalledWith(['bar.js']);
	});
});
