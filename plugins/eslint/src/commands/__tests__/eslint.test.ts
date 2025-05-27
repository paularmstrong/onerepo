import * as onerepo from 'onerepo';
import * as glob from 'glob';
import * as jiti from 'jiti';
import { getCommand } from '@onerepo/test-cli';
import * as Eslint from '../eslint';

const { build, run, graph } = getCommand(Eslint);

async function mockFn(requireActual) {
	const actual = await requireActual();
	const mocked = {};
	for (const [key, val] of Object.entries(actual as Record<string, unknown>)) {
		if (typeof val === 'function') {
			// @ts-ignore
			mocked[key] = vi.fn(val);
		} else {
			// @ts-ignore
			mocked[key] = actual[key];
		}
	}
	return mocked;
}
vi.mock('glob', mockFn);
vi.mock('jiti', mockFn);

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
	beforeEach(() => {
		vi.spyOn(glob, 'glob').mockImplementation(async (str) => {
			if (typeof str === 'string' && str.startsWith('eslint.config')) {
				return ['eslint.config.ts'];
			}
			return [];
		});
		vi.spyOn(jiti, 'createJiti').mockReturnValue({ import: async () => [{}] });
	});

	test('can run across all files', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--all');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: ['--color', '--format', 'onerepo', '--cache', '--cache-strategy=content', '--fix', '--quiet', '.'],
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
					'--quiet',
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
				args: ['--color', '--format', 'onerepo', '--cache', '--cache-strategy=content', '--quiet', '.'],
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
				args: ['--color', '--format', 'onerepo', '--fix', '--quiet', '.'],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
	});

	test('updates the git index with --add', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(onerepo.git, 'updateIndex').mockResolvedValue('');

		await expect(run('-f bar.js --add')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: ['--color', '--format', 'onerepo', '--cache', '--cache-strategy=content', '--fix', '--quiet', 'bar.js'],
				opts: {
					env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: 'true' },
				},
			}),
		);
		expect(onerepo.git.updateIndex).toHaveBeenCalledWith(['bar.js']);
	});

	test('if --warnings, reports warnings as well', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--all --warnings');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eslint',
				args: expect.not.arrayContaining(['--quiet']),
			}),
		);
	});

	test('if not --warnings, does NOT report warnings', async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);

		await run('--all --no-warnings');

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
