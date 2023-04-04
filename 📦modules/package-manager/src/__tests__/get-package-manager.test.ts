import path from 'path';
import { getPackageManagerName } from '../get-package-manager';

describe('getPackageManagerName', () => {
	test.concurrent.each([
		['yarn', 'yarn@latest'],
		['yarn', 'yarn@3.3.1'],
		['pnpm', 'pnpm@latest'],
		['pnpm', 'pnpm@1.2.3'],
		['npm', 'npm@latest'],
		['npm', 'npm@6.8.7'],
	])('gets "%s" from "packageManager": "%s"', async (expected, value) => {
		expect(getPackageManagerName('.', value)).toEqual(expected);
	});

	test.each([
		['npm', 'packagelock'],
		['pnpm', 'pnpmlock'],
		['pnpm', 'pnpmworkyaml'],
		['yarn', 'yarnlock'],
		['yarn', 'yarnrcyaml'],
		['yarn', 'yarnrcyml'],
		['npm', 'unknown'],
	])('gets "%s" from %s fixture', async (expected, fixture) => {
		expect(getPackageManagerName(path.join(__dirname, '__fixtures__', fixture))).toEqual(expected);
	});
});
