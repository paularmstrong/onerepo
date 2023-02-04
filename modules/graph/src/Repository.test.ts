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
			'@onerepo/plugin-tasks',
			'@onerepo/plugin-install',
			'onerepo',
			'@onerepo/root',
			'@onerepo/prettier-config',
			'@onerepo/plugin-vitest',
			'@onerepo/plugin-prettier',
			'@onerepo/plugin-eslint',
			'@onerepo/plugin-docgen',
			'@onerepo/cli',
			'@onerepo/logger',
			'@onerepo/graph',
			'@onerepo/vitest',
			'@onerepo/eslint-plugin',
			'@onerepo/tsconfig',
		]);
		expect(repo.dependencies('@onerepo/vitest')).toEqual(['@onerepo/tsconfig']);
	});
});
