import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import { getAffected, getFilepaths, getWorkspaces } from '../getters.ts';

vi.mock('@onerepo/git');

const graph = await getGraph(path.join(__dirname, '__fixtures__', 'repo'));

describe('affected', () => {
	beforeEach(() => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue([]);
	});

	test('returns all Workspaces if the root is affected', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['not/in/a/module.json']);

		const workspaces = await getAffected(graph);

		expect(workspaces).toEqual(graph.workspaces);
	});

	test('only returns affected list', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/tacos/package.json']);

		const workspaces = await getAffected(graph);

		expect(workspaces).toEqual([graph.getByName('tacos'), graph.getByName('menu')]);
	});
});

describe('filepaths', () => {
	beforeEach(() => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue([]);
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

	test('returns Workspace locations if threshold is hit', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue([
			'modules/burritos/package.json',
			'modules/burritos/bar',
			'modules/burritos/baz',
		]);

		const paths = await getFilepaths(graph, { affected: true }, { affectedThreshold: 2 });
		expect(paths).toEqual(['modules/burritos']);
	});

	test('if threshold is zero, returns all files', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue([
			'modules/burritos/foo',
			'modules/burritos/bar',
			'modules/burritos/baz',
		]);

		const paths = await getFilepaths(graph, { affected: true }, { affectedThreshold: 0 });
		expect(paths).toEqual(['modules/burritos/foo', 'modules/burritos/bar', 'modules/burritos/baz']);
	});

	test('if root is affected and over threshold, only returns root filepath', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['foo', 'modules/burritos/bar', 'modules/burritos/baz']);

		const paths = await getFilepaths(graph, { affected: true }, { affectedThreshold: 2 });
		expect(paths).toEqual(['.']);
	});
});

describe('workspaces', () => {
	beforeEach(() => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue([]);
	});

	test('returns all Workspaces if root is affected', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['not/in/a/module.json']);

		const wss = await getWorkspaces(graph, { affected: true });
		expect(wss).toEqual(graph.workspaces);
	});

	test('returns all Workspaces if --all', async () => {
		const wss = await getWorkspaces(graph, { all: true });
		expect(wss).toEqual(graph.workspaces);
	});
});
