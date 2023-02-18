import * as subprocess from '@onerepo/subprocess';
import * as file from '@onerepo/file';
import * as git from '@onerepo/git';
import * as Prettier from './prettier';
import { getCommand } from '@onerepo/test-cli';

const { run } = getCommand(Prettier);

describe('handler', () => {
	test('can run across all files', async () => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);

		await run('--all');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: ['prettier', '--ignore-unknown', '--write', '.'],
			})
		);
	});

	test('can run across individual workspaces', async () => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		vi.spyOn(file, 'exists').mockResolvedValue(false);
		vi.spyOn(file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => true }
		);

		await expect(run('-w burritos -w tacos')).resolves.toBeUndefined();

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: ['prettier', '--ignore-unknown', '--write', 'modules/burritos', 'modules/tacos'],
			})
		);
	});

	test('does not write in dry-run', async () => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);

		await expect(run('-a --dry-run')).resolves.toBeUndefined();

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: ['prettier', '--ignore-unknown', '--list-different', '.'],
			})
		);
	});

	test('filters with .prettierignore', async () => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		vi.spyOn(file, 'exists').mockResolvedValue(true);
		vi.spyOn(file, 'read').mockResolvedValue(`
# ignore the comment
bar/**/*
`);
		vi.spyOn(file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => false }
		);
		await expect(run('-f foo.js -f bar/baz/bop.js')).resolves.toBeUndefined();

		expect(file.exists).toHaveBeenCalledWith(expect.stringMatching(/\.prettierignore$/), expect.any(Object));

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: ['prettier', '--ignore-unknown', '--write', 'foo.js'],
			})
		);
	});

	test('updates the git index for filtered paths with --add', async () => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		vi.spyOn(file, 'exists').mockResolvedValue(true);
		vi.spyOn(file, 'read').mockResolvedValue(`
# ignore the comment
*.xd
`);
		vi.spyOn(file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => false }
		);

		vi.spyOn(git, 'updateIndex').mockResolvedValue('');

		await expect(run('-f foo.xd -f bar.js --add')).resolves.toBeUndefined();

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npx',
				args: ['prettier', '--ignore-unknown', '--write', 'bar.js'],
			})
		);
		expect(git.updateIndex).toHaveBeenCalledWith(['bar.js']);
	});
});
