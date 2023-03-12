import path from 'node:path';
import { fileURLToPath } from 'node:url';

const actualRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../..');

/**
 * @param config {import('jest').Config}
 * @return {import('jest').Config}
 */
export function makeConfig(config) {
	const { rootDir = '', ...rest } = config;
	const configRoot = path.dirname(fileURLToPath(rootDir));
	return {
		clearMocks: true,
		resetMocks: true,
		restoreMocks: true,
		moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
		...rest,
		coveragePathIgnorePatterns: ['/__fixtures__/', ...(rest.coveragePathIgnorePatterns ?? [])],
		rootDir: actualRoot,
		modulePathIgnorePatterns: ['fixtures'],
		roots: [path.relative(actualRoot, configRoot ?? '.')],
		transformIgnorePatterns: ['/node_modules/(?!(inquirer|log-update))/', ...(config.transformIgnorePatterns ?? [])],
		transform: {
			'\\.[jt]sx?$': ['esbuild-jest', { sourcemap: true }],
			...config.transform,
		},
		watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
	};
}
