import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import { getAffected, getFilepaths, getWorkspaces } from './getters';

const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

const modified = {
	all: [],
	added: [],
	modified: [],
	deleted: [],
	moved: [],
	unknown: [],
};

describe('getAffected', () => {
	beforeEach(() => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(modified);
	});

	test('returns all workspaces if the root is affected', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue({
			...modified,
			modified: ['not/in/a/module.json'],
		});

		const workspaces = await getAffected(graph);

		expect(workspaces).toEqual(graph.workspaces);
	});

	test('only returns affected list', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue({
			all: [],
			added: [],
			modified: ['modules/tacos/package.json'],
			deleted: [],
			moved: [],
		});

		const workspaces = await getAffected(graph);

		expect(workspaces).toEqual([graph.getByName('tacos'), graph.getByName('menu')]);
	});
});

describe('getFilepaths', () => {
	beforeEach(() => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(modified);
	});

	test('returns "." if --all', async () => {
		const paths = await getFilepaths(graph, { all: true });

		expect(paths).toEqual(['.']);
	});

	test('returns "." if --all and any other valid arg', async () => {
		const pathFiles = await getFilepaths(graph, { all: true, files: ['foo'] });
		expect(pathFiles).toEqual(['.']);

		const pathWorkspaces = await getFilepaths(graph, { all: true, workspaces: ['foo'] });
		expect(pathWorkspaces).toEqual(['.']);

		const pathAffected = await getFilepaths(graph, { all: true, affected: true });
		expect(pathAffected).toEqual(['.']);
	});
});

describe('getWorkspaces', () => {
	beforeEach(() => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(modified);
	});

	test('returns all workspaces if root is affected', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue({
			all: [],
			added: [],
			modified: ['not/in/a/module.json'],
			deleted: [],
			moved: [],
		});

		const workspaces = await getWorkspaces(graph, { affected: true });
		expect(workspaces).toEqual(graph.workspaces);
	});

	test('returns all workspaces if --all', async () => {
		const workspaces = await getWorkspaces(graph, { all: true });
		expect(workspaces).toEqual(graph.workspaces);
	});
});
