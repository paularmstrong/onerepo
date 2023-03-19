import { getRootPackageJson } from '..';

describe('getRootPackageJson', () => {
	test('gets this repo’s root package.json', async () => {
		const { filePath, json } = await getRootPackageJson(process.cwd());
		expect(filePath).toMatch(/\/package.json$/);
		expect(json).toMatchObject({
			name: '@onerepo/root',
			private: true,
			workspaces: expect.any(Array),
		});
	});
});
