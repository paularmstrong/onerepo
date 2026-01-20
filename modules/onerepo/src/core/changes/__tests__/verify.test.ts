import path from 'node:path';
import * as git from '@onerepo/git';
import { getCommand } from '@onerepo/test-cli';
import { getGraph } from '@onerepo/graph';
import * as verify from '../verify.ts';

const graph = await getGraph(path.join(__dirname, '__fixtures__/with-entries'));
const { run } = await getCommand(verify, graph);

describe('verify', () => {
	test('fails with missing change entries', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/cheese/src/foo.ts']);

		await expect(run()).rejects.toMatch('Workspace "cheese" is missing a required change entry.');
	});

	test('does not fail for private workspaces', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/private/src/foo.ts']);

		await expect(run()).resolves.toBeTruthy();
	});

	test('does not fail if change entries are found for every public workspace', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue([
			'modules/cheese/src/foo.ts',
			'modules/cheese/.changes/000-yum-cheese.md',
			'modules/private/src/foo.ts',
			'modules/lettuce/src/foo.ts',
			'modules/lettuce/.changes/000-yum-lettuce.md',
		]);

		await expect(run()).resolves.toBeTruthy();
	});

	test('does not fail for changelog changes', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/cheese/CHANGELOG.md']);

		await expect(run()).resolves.toBeTruthy();
	});

	test('does not fail for changelog+package.json changes', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/cheese/CHANGELOG.md', 'modules/cheese/package.json']);

		await expect(run()).resolves.toBeTruthy();
	});

	test('fails for package.json changes', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/cheese/package.json']);

		await expect(run()).rejects.toMatch('Workspace "cheese" is missing a required change entry.');
	});
});
