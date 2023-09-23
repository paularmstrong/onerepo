import path from 'node:path';
import { fileURLToPath } from 'node:url';

function localPath(
	/** @type {string} */
	filepath,
) {
	return path.join(path.dirname(fileURLToPath(import.meta.url)), filepath);
}

/**
 * @param config {import('jest').Config}
 * @return {import('jest').Config}
 */
export function makeConfig(config) {
	const { rootDir = '', ...rest } = config;
	return {
		clearMocks: true,
		resetMocks: true,
		restoreMocks: true,
		moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
		...rest,
		coveragePathIgnorePatterns: [
			'/__fixtures__/',
			'/dist/',
			'.config.(mjs|cjs|ts|js)$',
			...(rest.coveragePathIgnorePatterns ?? []),
		],
		rootDir: path.dirname(fileURLToPath(rootDir)),
		moduleNameMapper: {
			'^prettier$': localPath('mocks/prettier.js'),
		},
		modulePathIgnorePatterns: ['fixtures'],
		setupFiles: [localPath('globals.js')],
		testPathIgnorePatterns: ['/dist/'],
		transformIgnorePatterns: ['/node_modules/(?!(inquirer|log-update))/', ...(config.transformIgnorePatterns ?? [])],
		transform: {
			'\\.[jt]sx?$': ['esbuild-jest', { sourcemap: true }],
			...config.transform,
		},
		watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
	};
}
