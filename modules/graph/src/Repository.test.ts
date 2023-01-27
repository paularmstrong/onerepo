import path from 'path';
import { getRootPackageJson } from '.';
import { Repository } from './Repository';

describe('Repository', () => {
	beforeEach(() => {
		// vi.spyOn(glob, 'sync').mockImplementation(() => []);
	});

	test('bucket', async () => {
		// vi.spyOn(glob, 'sync').mockImplementation(() => []);
		const result = await getRootPackageJson(process.cwd());
		const repo = new Repository(path.dirname(result.filePath), result.json);
		expect(repo.dependencies('@onerepo/vitest')).toEqual(['@onerepo/tsconfig']);
		expect(repo.dependencies()).toEqual([
			'@onerepo/cli',
			'@onerepo/graph',
			'@onerepo/vitest',
			'@onerepo/eslint-plugin',
			'@onerepo/tsconfig',
			'@onerepo/root',
			'@onerepo/prettier-config',
		]);
		expect(repo.dependencies('@onerepo/vitest')).toEqual(['@onerepo/tsconfig']);
	});
});
