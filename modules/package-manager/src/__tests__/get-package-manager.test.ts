import path from 'path';
import { getPackageManagerName } from '../get-package-manager';

describe('getPackageManagerName', () => {
	let ua: string | undefined;
	beforeAll(() => {
		ua = process.env.npm_config_user_agent;
	});

	afterAll(() => {
		process.env.npm_config_user_agent = ua;
	});

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
		process.env.npm_config_user_agent = undefined;
		expect(getPackageManagerName(path.join(__dirname, '__fixtures__', fixture))).toEqual(expected);
	});

	test.each([
		['pnpm', 'pnpm/7.29.3 npm/? node/v20.5.1 darwin x64'],
		['yarn', 'yarn/3.3.1 npm/? node/v20.5.1 darwin x64'],
		['npm', 'npm/9.8.0 node/v20.5.1 darwin x64 workspaces/false'],
	])('gets %s from the npm_config_user_agent var', async (expected, envvar) => {
		process.env.npm_config_user_agent = envvar;
		expect(getPackageManagerName('.')).toEqual(expected);
	});
});
