/** @type {import('jest').Config} */
export default {
	moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
	transformIgnorePatterns: ['/node_modules/(?!(inquirer|log-update))/'],
	transform: {
		'\\.[jt]sx?$': ['esbuild-jest', { sourcemap: true }],
	},
};
