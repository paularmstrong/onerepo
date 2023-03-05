import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import { affected, filepaths, workspaces } from './getters';

const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

const modified = {
	all: [],
	added: [],
	modified: [],
	deleted: [],
	moved: [],
	unknown: [],
};

describe('affected', () => {
	beforeEach(() => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(modified);
	});

	test('returns all workspaces if the root is affected', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue({
			...modified,
			modified: ['not/in/a/module.json'],
		});

		const workspaces = await affected(graph);

		expect(workspaces).toEqual(graph.workspaces);
	});

	test('only returns affected list', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue({
			...modified,
			modified: ['modules/tacos/package.json'],
		});

		const workspaces = await affected(graph);

		expect(workspaces).toEqual([graph.getByName('tacos'), graph.getByName('menu')]);
	});
});

describe('filepaths', () => {
	beforeEach(() => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(modified);
	});

	test('returns "." if --all', async () => {
		const paths = await filepaths(graph, { all: true });

		expect(paths).toEqual(['.']);
	});

	test('returns "." if --all and any other valid arg', async () => {
		const pathFiles = await filepaths(graph, { all: true, files: ['foo'] });
		expect(pathFiles).toEqual(['.']);

		const pathWorkspaces = await filepaths(graph, { all: true, workspaces: ['foo'] });
		expect(pathWorkspaces).toEqual(['.']);

		const pathAffected = await filepaths(graph, { all: true, affected: true });
		expect(pathAffected).toEqual(['.']);
	});
});

describe('workspaces', () => {
	beforeEach(() => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(modified);
	});

	test('returns all workspaces if root is affected', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue({
			...modified,
			modified: ['not/in/a/module.json'],
		});

		const wss = await workspaces(graph, { affected: true });
		expect(wss).toEqual(graph.workspaces);
	});

	test('returns all workspaces if --all', async () => {
		const wss = await workspaces(graph, { all: true });
		expect(wss).toEqual(graph.workspaces);
	});
});
