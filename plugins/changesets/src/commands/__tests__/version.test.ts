import path from 'node:path';
import inquirer from 'inquirer';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import * as applyReleasePlan from '@changesets/apply-release-plan';
import { getCommand } from '@onerepo/test-cli';
import * as Version from '../version';

const { run } = getCommand(Version);
const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

vi.mock('@changesets/apply-release-plan');

describe('handler', () => {
	beforeEach(async () => {
		vi.spyOn(graph.packageManager, 'install').mockResolvedValue('lockfile');
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: [] });
		vi.spyOn(applyReleasePlan, 'default').mockImplementation(async () => []);
		vi.spyOn(git, 'isClean').mockResolvedValue(true);
		vi.spyOn(git, 'updateIndex').mockResolvedValue('');
	});

	test('does nothing if git working tree is dirty', async () => {
		vi.spyOn(git, 'isClean').mockResolvedValue(false);
		await expect(run('', { graph })).rejects.toMatch(
			'Working directory must be unmodified to ensure correct versioning',
		);

		expect(inquirer.prompt).not.toHaveBeenCalled();
		expect(applyReleasePlan.default).not.toHaveBeenCalled();
	});

	test('can bypass the dirty working state check', async () => {
		vi.spyOn(git, 'isClean').mockResolvedValue(false);
		await run('--allow-dirty', { graph });

		expect(git.isClean).not.toHaveBeenCalled();
	});

	test('prompts for all modules with changes only', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['burritos', 'churros', 'tortillas'], okay: true });

		await run('', { graph });
		expect(inquirer.prompt).toHaveBeenCalledWith([
			expect.objectContaining({
				choices: ['burritos', 'churros', 'tacos', 'tortillas'],
			}),
		]);
		expect(inquirer.prompt).not.toHaveBeenCalledWith([
			expect.objectContaining({
				choices: expect.arrayContaining(['tortas']),
			}),
		]);
	});

	test('updates versions across Workspaces and updates the git index', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['tortillas'] });

		await run('', { graph });

		expect(applyReleasePlan.default).toHaveBeenCalledWith(
			expect.objectContaining({ changesets: [expect.objectContaining({ id: 'baz-bop-qux' })] }),
			expect.any(Object),
			expect.any(Object),
		);

		expect(git.updateIndex).toHaveBeenCalledWith([
			expect.stringContaining('repo/.changeset'),
			'lockfile',
			expect.stringContaining('repo/package.json'),
			expect.stringContaining('repo/modules/burritos/package.json'),
			expect.stringContaining('repo/modules/burritos/CHANGELOG.md'),
			expect.stringContaining('repo/modules/churros/package.json'),
			expect.stringContaining('repo/modules/churros/CHANGELOG.md'),
			expect.stringContaining('repo/modules/tacos/package.json'),
			expect.stringContaining('repo/modules/tacos/CHANGELOG.md'),
			expect.stringContaining('repo/modules/tortas/package.json'),
			expect.stringContaining('repo/modules/tortas/CHANGELOG.md'),
			expect.stringContaining('repo/modules/tortillas/package.json'),
			expect.stringContaining('repo/modules/tortillas/CHANGELOG.md'),
		]);
	});

	test('updates only prod dependencies', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['tacos'] });
		await run('', { graph });

		expect(applyReleasePlan.default).toHaveBeenCalledWith(
			expect.objectContaining({
				changesets: [expect.objectContaining({ id: 'guh-gaz-gop' })],
				releases: [expect.objectContaining({ name: 'tacos', oldVersion: '0.2.0', newVersion: '0.3.0' })],
			}),
			expect.any(Object),
			expect.any(Object),
		);

		expect(applyReleasePlan.default).not.toHaveBeenCalledWith(
			expect.objectContaining({
				releases: expect.arrayContaining([expect.objectContaining({ name: 'tortillas' })]),
			}),
			expect.any(Object),
			expect.any(Object),
		);
	});

	test('does nothing if no modules selected', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: [] });

		await run('', { graph });

		expect(applyReleasePlan.default).not.toHaveBeenCalled();
		expect(git.updateIndex).not.toHaveBeenCalled();
	});

	test('does not update git index if not --add', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['tortillas'] });

		await run('--no-add', { graph });

		expect(git.updateIndex).not.toHaveBeenCalled();
	});

	test('does nothing if --dry-run', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['tortillas'] });

		await run('--dry-run', { graph });

		expect(applyReleasePlan.default).not.toHaveBeenCalled();
		expect(git.updateIndex).not.toHaveBeenCalled();
	});

	test('when changesets affect un-selected workspaces, prompts for okay to version those as well', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'interconnected'));
		vi.spyOn(inquirer, 'prompt')
			.mockResolvedValueOnce({ choices: ['churros'] })
			.mockResolvedValueOnce({ okay: true });
		await run('', { graph });

		expect(applyReleasePlan.default).toHaveBeenCalledWith(
			expect.objectContaining({
				changesets: [expect.objectContaining({ id: 'baz-bop-qux' }), expect.objectContaining({ id: 'foo-bar-baz' })],
				releases: expect.arrayContaining([
					expect.objectContaining({ name: 'tortillas' }),
					expect.objectContaining({ name: 'burritos' }),
					expect.objectContaining({ name: 'churros' }),
					expect.objectContaining({ name: 'tacos' }),
				]),
			}),
			expect.any(Object),
			expect.any(Object),
		);
	});

	test('when changesets affect un-selected workspaces, can exit at okay prompt', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'interconnected'));
		vi.spyOn(inquirer, 'prompt')
			.mockResolvedValueOnce({ choices: ['churros'] })
			.mockResolvedValueOnce({ okay: false });
		await run('', { graph });

		expect(applyReleasePlan.default).not.toHaveBeenCalled();
	});
});
