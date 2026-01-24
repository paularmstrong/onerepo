import type { PublicPackageJson } from '../package-json';
import { getPublishablePackageJson } from '../package-json.ts';

describe('Workspace', () => {
	describe('publishablePackageJson', () => {
		test('applies known keys over the root', async () => {
			const pkg: PublicPackageJson = {
				name: 'tacos',
				version: '1.0.0',
				main: './src/tacos.ts',
				publishConfig: {
					main: './dist/tacos.js',
					typings: './dist/types/tacos.d.ts',
				},
			};

			expect(getPublishablePackageJson(pkg)).toEqual({
				name: 'tacos',
				version: '1.0.0',
				main: './dist/tacos.js',
				typings: './dist/types/tacos.d.ts',
				publishConfig: {},
			});
		});

		test('preserves known publishConfig keys from npm', async () => {
			const pkg: PublicPackageJson = {
				name: 'tacos',
				version: '1.0.0',
				main: './src/tacos.ts',
				publishConfig: {
					main: './dist/tacos.js',
					typings: './dist/types/tacos.d.ts',
					access: 'public',
					preid: '123',
				},
			};

			expect(getPublishablePackageJson(pkg)).toEqual({
				name: 'tacos',
				version: '1.0.0',
				main: './dist/tacos.js',
				typings: './dist/types/tacos.d.ts',
				publishConfig: {
					access: 'public',
					preid: '123',
				},
			});
		});

		test('strips devDependencies', async () => {
			const pkg: PublicPackageJson = {
				name: 'tacos',
				version: '1.0.0',
				dependencies: {
					lettuce: '4.0.0',
				},
				devDependencies: {
					grill: '1.5.0',
				},
			};

			expect(getPublishablePackageJson(pkg)).toEqual({
				name: 'tacos',
				version: '1.0.0',
				dependencies: {
					lettuce: '4.0.0',
				},
			});
		});
	});
});
