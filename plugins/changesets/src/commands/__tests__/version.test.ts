import path from 'node:path';
import inquirer from 'inquirer';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import * as applyReleasePlan from '@changesets/apply-release-plan';
import { getCommand } from '@onerepo/test-cli';
import * as Version from '../version';

const { run } = getCommand(Version);
const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

jest.mock('@changesets/apply-release-plan');
jest.mock('@onerepo/git');

describe('handler', () => {
	beforeEach(async () => {
		jest.spyOn(graph.packageManager, 'install').mockResolvedValue('lockfile');
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: [] });
		jest.spyOn(applyReleasePlan, 'default').mockImplementation(async () => []);
		jest.spyOn(git, 'isClean').mockResolvedValue(true);
		jest.spyOn(git, 'updateIndex').mockResolvedValue('');
	});

	test('does nothing if git working tree is dirty', async () => {
		jest.spyOn(git, 'isClean').mockResolvedValue(false);
		await expect(run('', { graph })).rejects.toMatch(
			'Working directory must be unmodified to ensure correct versioning'
		);

		expect(inquirer.prompt).not.toHaveBeenCalled();
		expect(applyReleasePlan.default).not.toHaveBeenCalled();
	});

	test('can bypass the dirty working state check', async () => {
		jest.spyOn(git, 'isClean').mockResolvedValue(false);
		await run('--allow-dirty', { graph });

		expect(git.isClean).not.toHaveBeenCalled();
	});

	test('prompts for all modules with changes only', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['burritos', 'churros', 'tortillas'], okay: true });

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

	test('updates versions across workspaces and updates the git index', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['tortillas'] });

		await run('', { graph });

		expect(applyReleasePlan.default).toHaveBeenCalledWith(
			expect.objectContaining({ changesets: [expect.objectContaining({ id: 'baz-bop-qux' })] }),
			expect.any(Object),
			expect.any(Object)
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
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['tacos'] });
		await run('', { graph });

		expect(applyReleasePlan.default).toHaveBeenCalledWith(
			expect.objectContaining({
				changesets: [expect.objectContaining({ id: 'guh-gaz-gop' })],
				releases: [expect.objectContaining({ name: 'tacos', oldVersion: '0.2.0', newVersion: '0.3.0' })],
			}),
			expect.any(Object),
			expect.any(Object)
		);

		expect(applyReleasePlan.default).not.toHaveBeenCalledWith(
			expect.objectContaining({
				releases: expect.arrayContaining([expect.objectContaining({ name: 'tortillas' })]),
			}),
			expect.any(Object),
			expect.any(Object)
		);
	});

	test('does nothing if no modules selected', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: [] });

		await run('', { graph });

		expect(applyReleasePlan.default).not.toHaveBeenCalled();
		expect(git.updateIndex).not.toHaveBeenCalled();
	});

	test('does not update git index if not --add', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['tortillas'] });

		await run('--no-add', { graph });

		expect(git.updateIndex).not.toHaveBeenCalled();
	});

	test('does nothing if --dry-run', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['tortillas'] });

		await run('--dry-run', { graph });

		expect(applyReleasePlan.default).not.toHaveBeenCalled();
		expect(git.updateIndex).not.toHaveBeenCalled();
	});

	test('when changesets affect un-selected workspaces, prompts for okay to version those as well', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'interconnected'));
		jest
			.spyOn(inquirer, 'prompt')
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
			expect.any(Object)
		);
	});

	test('when changesets affect un-selected workspaces, can exit at okay prompt', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'interconnected'));
		jest
			.spyOn(inquirer, 'prompt')
			.mockResolvedValueOnce({ choices: ['churros'] })
			.mockResolvedValueOnce({ okay: false });
		await run('', { graph });

		expect(applyReleasePlan.default).not.toHaveBeenCalled();
	});
});
