import * as file from '@onerepo/file';
import * as git from '@onerepo/git';
import { getCommand } from '@onerepo/test-cli';
import * as Eslint from '../eslint';

jest.mock('@onerepo/git');
jest.mock('@onerepo/subprocess');
jest.mock('@onerepo/file', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/file'),
}));

const { build, run, graph } = getCommand(Eslint);

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
	test('can run across all files', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--all');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: [
					'--ext',
					'js,cjs,mjs',
					'--color',
					'--format',
					'onerepo',
					'--cache',
					'--cache-strategy=content',
					'--fix',
					'.',
				],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
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
				cmd: 'eslint',
				args: [
					'--ext',
					'js,cjs,mjs',
					'--color',
					'--format',
					'onerepo',
					'--cache',
					'--cache-strategy=content',
					'--fix',
					'modules/burritos',
					'modules/tacos',
				],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
	});

	test('does not fix in dry-run', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await expect(run('-a --dry-run')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: ['--ext', 'js,cjs,mjs', '--color', '--format', 'onerepo', '--cache', '--cache-strategy=content', '.'],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
	});

	test('does not fix in no-cache', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await expect(run('-a --no-cache')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: ['--ext', 'js,cjs,mjs', '--color', '--format', 'onerepo', '--fix', '.'],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
	});

	test('filters unapproved extensions', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await expect(run('-f foo.xd -f bar.js')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: [
					'--ext',
					'js,cjs,mjs',
					'--color',
					'--format',
					'onerepo',
					'--cache',
					'--cache-strategy=content',
					'--fix',
					'bar.js',
				],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
	});

	test('filters with .eslintignore', async () => {
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

		expect(file.exists).toHaveBeenCalledWith(expect.stringMatching(/\.eslintignore$/), expect.any(Object));

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: [
					'--ext',
					'js,cjs,mjs',
					'--color',
					'--format',
					'onerepo',
					'--cache',
					'--cache-strategy=content',
					'--fix',
					'foo.js',
				],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
	});

	test('updates the git index for filtered paths with --add', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		jest.spyOn(git, 'updateIndex').mockResolvedValue('');

		await expect(run('-f foo.xd -f bar.js --add')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: [
					'--ext',
					'js,cjs,mjs',
					'--color',
					'--format',
					'onerepo',
					'--cache',
					'--cache-strategy=content',
					'--fix',
					'bar.js',
				],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
		expect(git.updateIndex).toHaveBeenCalledWith(['bar.js']);
	});

	test('if --quiet, reports errors only', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--all --quiet');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: expect.arrayContaining(['--quiet']),
			}),
		);
	});

	test('can turn off colors with --no-pretty', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--no-pretty -a');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: expect.arrayContaining(['--no-color']),
			}),
		);
	});

	test('can override the default formatter', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('-a -- --format junit');

		expect(graph.packageManager.run).not.toHaveBeenCalledWith(
			expect.objectContaining({
				args: expect.arrayContaining(['--format', 'onerepo']),
			}),
		);
	});

	test('can disable GitHub annotations', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('-a --no-github-annotate');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'false' },
				},
			}),
		);
	});

	test('proxies github annotations to stdout directly', async () => {
		jest.spyOn(process.stdout, 'write').mockReturnValue(true);
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue([
			`
::error burritos

something
::warning tacos
`,
			'',
		]);

		await expect(run('-a')).rejects.toMatch('something');

		expect(process.stdout.write).toHaveBeenCalledWith('::error burritos\n::warning tacos');
		expect(process.stdout.write).toHaveBeenCalledWith('\n');
	});

	test('if eslint returns with any stderr, the command will fail', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', 'oh no!']);

		await expect(run('-a')).rejects.toMatch('oh no!');
	});
});
