import path from 'path';
import { createJiti } from 'jiti';
import { getRootPackageJson } from '..';
import { DependencyType, Graph } from '../Graph';

const require = createJiti(process.cwd(), { interopDefault: true });

describe('Graph', () => {
	test('bucket', async () => {
		const location = path.join(__dirname, '__fixtures__', 'repo');
		const result = getRootPackageJson(location);
		const repo = new Graph(location, result.json, result.json.workspaces!, require);
		expect(repo.dependencies('burritos').map(({ name }) => name)).toEqual(['lettuce']);
		expect(repo.dependencies('lettuce')).toEqual([]);
		expect(repo.dependencies().map(({ name }) => name)).toEqual(['tacos', 'burritos', 'lettuce', 'fixture-root']);
	});

	test('cannot reuse an alias', async () => {
		const location = path.join(__dirname, '__fixtures__', 'reused-alias');
		const result = getRootPackageJson(location);

		expect(() => new Graph(location, result.json, result.json.workspaces!, require)).toThrow(
			new Error('Cannot add alias "leaf" for spinach because it is already used for lettuce.'),
		);
	});

	test('can get all dependencies', async () => {
		const location = path.join(__dirname, '__fixtures__', 'repo');
		const result = getRootPackageJson(location);
		const repo = new Graph(location, result.json, result.json.workspaces!, require);

		expect(repo.dependencies()).toEqual([
			expect.objectContaining({ name: 'tacos' }),
			expect.objectContaining({ name: 'burritos' }),
			expect.objectContaining({ name: 'lettuce' }),
			expect.objectContaining({ name: 'fixture-root' }),
		]);
	});

	test('can get isolated dependencies', async () => {
		const location = path.join(__dirname, '__fixtures__', 'repo');
		const result = getRootPackageJson(location);
		const repo = new Graph(location, result.json, result.json.workspaces!, require);

		expect(repo.dependencies('tacos')).toEqual([expect.objectContaining({ name: 'lettuce' })]);
	});

	test('can get all dependents', async () => {
		const location = path.join(__dirname, '__fixtures__', 'repo');
		const result = getRootPackageJson(location);
		const repo = new Graph(location, result.json, result.json.workspaces!, require);

		expect(repo.dependents()).toEqual([
			expect.objectContaining({ name: 'lettuce' }),
			expect.objectContaining({ name: 'tacos' }),
			expect.objectContaining({ name: 'burritos' }),
			expect.objectContaining({ name: 'fixture-root' }),
		]);
	});

	test('can get isolated dependents', async () => {
		const location = path.join(__dirname, '__fixtures__', 'repo');
		const result = getRootPackageJson(location);
		const repo = new Graph(location, result.json, result.json.workspaces!, require);

		expect(repo.dependents('lettuce')).toEqual([
			expect.objectContaining({ name: 'tacos' }),
			expect.objectContaining({ name: 'burritos' }),
		]);
	});

	test('can get all prod dependencies', async () => {
		const location = path.join(__dirname, '__fixtures__', 'repo');
		const result = getRootPackageJson(location);
		const repo = new Graph(location, result.json, result.json.workspaces!, require);

		expect(repo.dependencies(undefined, true, DependencyType.DEV).map((w) => w.name)).toEqual([
			'tacos',
			'lettuce',
			'burritos',
			'fixture-root',
		]);
	});

	test('can get prod-only isolated dependencies', async () => {
		const location = path.join(__dirname, '__fixtures__', 'repo');
		const result = getRootPackageJson(location);
		const repo = new Graph(location, result.json, result.json.workspaces!, require);

		expect(repo.dependencies('tacos', true, DependencyType.PROD).map((w) => w.name)).toEqual(['tacos']);
		expect(repo.dependencies('burritos', true, DependencyType.PROD).map((w) => w.name)).toEqual([
			'burritos',
			'lettuce',
		]);
	});

	test('can get prod-only isolated dependents', async () => {
		const location = path.join(__dirname, '__fixtures__', 'repo');
		const result = getRootPackageJson(location);
		const repo = new Graph(location, result.json, result.json.workspaces!, require);

		expect(repo.dependents('lettuce', true, DependencyType.PROD).map((w) => w.name)).toEqual(['lettuce', 'burritos']);
	});

	test('can get all dev dependencies', async () => {
		const location = path.join(__dirname, '__fixtures__', 'repo');
		const result = getRootPackageJson(location);
		const repo = new Graph(location, result.json, result.json.workspaces!, require);

		expect(repo.dependencies(undefined, true, DependencyType.DEV).map((w) => w.name)).toEqual([
			'tacos',
			'lettuce',
			'burritos',
			'fixture-root',
		]);
	});

	test('can get dev-only isolated dependencies', async () => {
		const location = path.join(__dirname, '__fixtures__', 'repo');
		const result = getRootPackageJson(location);
		const repo = new Graph(location, result.json, result.json.workspaces!, require);

		expect(repo.dependencies('burritos', true, DependencyType.DEV).map((w) => w.name)).toEqual(['burritos']);
		expect(repo.dependencies('tacos', true, DependencyType.DEV).map((w) => w.name)).toEqual(['tacos', 'lettuce']);
	});

	test('can get dev-only isolated dependents', async () => {
		const location = path.join(__dirname, '__fixtures__', 'repo');
		const result = getRootPackageJson(location);
		const repo = new Graph(location, result.json, result.json.workspaces!, require);

		expect(repo.dependents('burritos', true, DependencyType.DEV).map((w) => w.name)).toEqual(['burritos']);
		expect(repo.dependents('lettuce', true, DependencyType.DEV).map((w) => w.name)).toEqual(['lettuce', 'tacos']);
	});
});
