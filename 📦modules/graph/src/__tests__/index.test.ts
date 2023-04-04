import path from 'node:path';
import { getGraph, getRootPackageJson } from '..';

describe('getRootPackageJson', () => {
	test('gets this repo’s root package.json', async () => {
		const { filePath, json } = getRootPackageJson(process.cwd());
		expect(filePath).toMatch(/\/package.json$/);
		expect(json).toMatchObject({
			name: '@onerepo/root',
			private: true,
			workspaces: expect.any(Array),
		});
	});
});

describe('getGraph', () => {
	test('gets a graph for pnpm repos', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__/pnpm'));
		expect(graph.root.name).toMatch('pnpm');
		expect(graph.serialized).toMatchObject({
			nodes: [{ id: 'pnpm' }, { id: 'pnpm-0' }, { id: 'pnpm-1' }],
		});
	});
});
