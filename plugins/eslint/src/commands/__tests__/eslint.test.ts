import path from 'node:path';
import * as onerepo from 'onerepo';
import { getCommand } from '@onerepo/test-cli';
import * as Eslint from '../eslint';

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
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--all');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: ['--color', '--format', 'onerepo', '--cache', '--cache-strategy=content', '--fix', '.'],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
	});

	test('passes --ext if configured', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--all --extensions=mjs,cjs,ts');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: [
					'--color',
					'--ext',
					'mjs,cjs,ts',
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
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(onerepo.file, 'exists').mockResolvedValue(false);
		vi.spyOn(onerepo.file, 'lstat').mockResolvedValue(
			// @ts-ignore mock
			{ isDirectory: () => true },
		);

		await expect(run('-w burritos -w tacos')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: [
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
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await expect(run('-a --dry-run')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: ['--color', '--format', 'onerepo', '--cache', '--cache-strategy=content', '.'],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
	});

	test('does not fix in no-cache', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await expect(run('-a --no-cache')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: ['--color', '--format', 'onerepo', '--fix', '.'],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
	});

	test('filters unapproved extensions', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await expect(run('--extensions mjs js -f foo.xd -f bar.js')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: [
					'--color',
					'--ext',
					'mjs,js',
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

		expect(onerepo.file.exists).toHaveBeenCalledWith(expect.stringMatching(/\.eslintignore$/), expect.any(Object));

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: ['--color', '--format', 'onerepo', '--cache', '--cache-strategy=content', '--fix', 'foo.js'],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
	});

	test('filtering works with absolute paths', async () => {
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
		await expect(
			run(`-f ${path.join(graph.root.location, 'foo.js')} -f ${path.join(graph.root.location, 'bar/baz/bop.js')}`),
		).resolves.toBeTruthy();

		expect(onerepo.file.exists).toHaveBeenCalledWith(expect.stringMatching(/\.eslintignore$/), expect.any(Object));

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: ['--color', '--format', 'onerepo', '--cache', '--cache-strategy=content', '--fix', 'foo.js'],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
	});

	test('updates the git index for filtered paths with --add', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(onerepo.git, 'updateIndex').mockResolvedValue('');

		await expect(run('--extensions mjs js -f foo.xd -f bar.js --add')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: [
					'--color',
					'--ext',
					'mjs,js',
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
		expect(onerepo.git.updateIndex).toHaveBeenCalledWith(['bar.js']);
	});

	test('if --quiet, reports errors only', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--all --quiet');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: expect.arrayContaining(['--quiet']),
			}),
		);
	});

	test('can turn off colors with --no-pretty', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--no-pretty -a');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: expect.arrayContaining(['--no-color']),
			}),
		);
	});

	test('can override the default formatter', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('-a -- --format junit');

		expect(graph.packageManager.run).not.toHaveBeenCalledWith(
			expect.objectContaining({
				args: expect.arrayContaining(['--format', 'onerepo']),
			}),
		);
	});

	test('can disable GitHub annotations', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

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
		vi.spyOn(process.stdout, 'write').mockReturnValue(true);
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue([
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
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', 'oh no!']);

		await expect(run('-a')).rejects.toMatch('oh no!');
	});
});
