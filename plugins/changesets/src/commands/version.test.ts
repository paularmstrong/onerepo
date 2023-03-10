import path from 'node:path';
import inquirer from 'inquirer';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import * as applyReleasePlan from '@changesets/apply-release-plan';
import * as Version from './version';

import { getCommand } from '@onerepo/test-cli';

const { run } = getCommand(Version);

jest.mock('@changesets/apply-release-plan');
jest.mock('@onerepo/git');

describe('handler', () => {
	beforeEach(async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: [] });
		jest.spyOn(applyReleasePlan, 'default').mockImplementation(async () => []);
		jest.spyOn(git, 'getStatus').mockResolvedValue('');
		jest.spyOn(git, 'updateIndex').mockResolvedValue('');
	});

	test('does nothing if git working tree is dirty', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(git, 'getStatus').mockResolvedValue('M  Foobar');
		await expect(run('', { graph })).rejects.toBeUndefined();

		expect(inquirer.prompt).not.toHaveBeenCalled();
		expect(applyReleasePlan.default).not.toHaveBeenCalled();
	});

	test('can bypass the dirty working state check', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(git, 'getStatus').mockResolvedValue('M  Foobar');
		await run('--allow-dirty', { graph });

		expect(git.getStatus).not.toHaveBeenCalled();
	});

	test('prompts for all modules with changes only', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('', { graph });
		expect(inquirer.prompt).toHaveBeenCalledWith([
			expect.objectContaining({
				choices: ['burritos', 'churros', 'tortillas'],
			}),
		]);
		expect(inquirer.prompt).not.toHaveBeenCalledWith([
			expect.objectContaining({
				choices: expect.arrayContaining(['tacos']),
			}),
		]);
	});

	test('updates versions across workspaces and updates the git index', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['tortillas'] });

		await run('', { graph });

		expect(applyReleasePlan.default).toHaveBeenCalledWith(
			expect.objectContaining({ changesets: [expect.objectContaining({ id: 'baz-bop-qux' })] }),
			expect.any(Object),
			expect.any(Object)
		);

		expect(git.updateIndex).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.stringContaining('modules/burritos/package.json'),
				expect.stringContaining('modules/burritos/CHANGELOG.md'),
				expect.stringContaining('modules/churros/package.json'),
				expect.stringContaining('modules/churros/CHANGELOG.md'),
				expect.stringContaining('modules/tacos/package.json'),
				expect.stringContaining('modules/tacos/CHANGELOG.md'),
				expect.stringContaining('modules/tortillas/package.json'),
				expect.stringContaining('modules/tortillas/CHANGELOG.md'),
			])
		);
	});

	test('does nothing if no modules selected', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: [] });

		await run('', { graph });

		expect(applyReleasePlan.default).not.toHaveBeenCalled();
		expect(git.updateIndex).not.toHaveBeenCalled();
	});

	test('does not update git index if not --add', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['tortillas'] });

		await run('--no-add', { graph });

		expect(git.updateIndex).not.toHaveBeenCalled();
	});

	test('does nothing if --dry-run', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
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
