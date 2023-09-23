import path from 'node:path';
import inquirer from 'inquirer';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import * as changesetWrite from '@changesets/write';
import { getCommand } from '@onerepo/test-cli';
import * as Command from '../add';

const { run } = getCommand(Command);
const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

vi.mock('@changesets/write');

describe('handler', () => {
	beforeEach(() => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: [] });
		vi.spyOn(changesetWrite, 'default').mockResolvedValue('smelly-tacos-fart');
		vi.spyOn(git, 'updateIndex').mockResolvedValue('');
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos']);
	});

	test.only('writes a changeset', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({
			chosen: ['burritos', 'churros'],
			patch: false,
			minor: true,
			contents: 'Just some tacos…',
		});

		await run('', { graph });

		expect(changesetWrite.default).toHaveBeenCalledWith(
			{
				summary: 'Just some tacos…',
				releases: [
					{ name: 'burritos', type: 'minor' },
					{ name: 'churros', type: 'minor' },
				],
			},
			graph.root.location,
		);

		expect(git.updateIndex).toHaveBeenCalledWith(graph.root.resolve('.changeset/smelly-tacos-fart.md'));
	});

	test('exits if no chosen workspaces', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({
			chosen: [],
		});

		await expect(run('', { graph })).rejects.toMatch('No workspaces were chosen');

		expect(changesetWrite.default).not.toHaveBeenCalled();
		expect(git.updateIndex).not.toHaveBeenCalled();
	});

	test('exits if no semver type', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({
			chosen: ['burritos'],
		});

		await expect(run('', { graph })).rejects.toMatch('No semantic version type chosen');

		expect(changesetWrite.default).not.toHaveBeenCalled();
		expect(git.updateIndex).not.toHaveBeenCalled();
	});
});
