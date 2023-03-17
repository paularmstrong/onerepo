import path from 'path';
import { getPackageManager } from '../get-package-manager';

describe('getPackageManager', () => {
	test.concurrent.each([
		['yarn', 'yarn@latest'],
		['yarn', 'yarn@3.3.1'],
		['pnpm', 'pnpm@latest'],
		['pnpm', 'pnpm@1.2.3'],
		['npm', 'npm@latest'],
		['npm', 'npm@6.8.7'],
	])('gets "%s" from "packageManager": "%s"', async (expected, value) => {
		expect(getPackageManager('.', value)).toEqual(expected);
	});

	test.each([
		['npm', 'packagelock'],
		['pnpm', 'pnpmlock'],
		['pnpm', 'pnpmworkyaml'],
		['pnpm', 'pnpmworkyml'],
		['yarn', 'yarnlock'],
		['yarn', 'yarnrcyaml'],
		['yarn', 'yarnrcyml'],
		['npm', 'unknown'],
	])('gets "%s" from %s fixture', async (expected, fixture) => {
		expect(getPackageManager(path.join(__dirname, '__fixtures__', fixture))).toEqual(expected);
	});
});
