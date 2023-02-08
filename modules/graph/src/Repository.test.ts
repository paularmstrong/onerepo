import path from 'path';
import { getRootPackageJson } from '.';
import { Repository } from './Repository';

describe('Repository', () => {
	test('bucket', async () => {
		const location = path.join(__dirname, 'fixtures', 'repo');
		const result = await getRootPackageJson(location);
		const repo = new Repository(location, result.json);
		expect(repo.dependencies('fixture-burritos')).toEqual(['fixture-lettuce']);
		expect(repo.dependencies('fixture-lettuce')).toEqual([]);
		expect(repo.dependencies()).toEqual(['fixture-tacos', 'fixture-burritos', 'fixture-lettuce', 'fixture-root']);
	});
});
