import path from 'path';
import { getRootPackageJson } from '.';
import { Graph } from './Graph';

describe('Graph', () => {
	test('bucket', async () => {
		const location = path.join(__dirname, 'fixtures', 'repo');
		const result = await getRootPackageJson(location);
		const repo = new Graph(location, result.json, require);
		expect(repo.dependencies('fixture-burritos').map(({ name }) => name)).toEqual(['fixture-lettuce']);
		expect(repo.dependencies('fixture-lettuce')).toEqual([]);
		expect(repo.dependencies().map(({ name }) => name)).toEqual([
			'fixture-tacos',
			'fixture-burritos',
			'fixture-lettuce',
			'fixture-root',
		]);
	});

	test('cannot reuse an alias', async () => {
		const location = path.join(__dirname, 'fixtures', 'reused-alias');
		const result = await getRootPackageJson(location);

		expect(() => new Graph(location, result.json, require)).toThrow(
			new Error('Cannot add alias "leaf" for spinach because it is already used for lettuce.')
		);
	});
});
