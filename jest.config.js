/** @type {import('jest').Config} */
export default {
	projects: [
		'<rootDir>/modules/*/jest.config.js',
		'<rootDir>/plugins/*/jest.config.js',
		'<rootDir>/internal/*/jest.config.js',
	],
};

// export default {
// 	clearMocks: true,
// 	resetMocks: true,
// 	restoreMocks: true,
// 	// displayName: 'vitest',
// 	moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
// 	// rootDir: './',
// 	testMatch: ['<rootDir>/plugins/vitest/**/*.test.[jt]s?(x)'],
// 	transformIgnorePatterns: ['/node_modules/(?!(inquirer|log-update))/'],
// 	transform: {
// 		'\\.[jt]sx?$': [
// 			'esbuild-jest',
// 			{
// 				sourcemap: true,
// 			},
// 		],
// 	},
// };

// export default {
// 	moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
// 	clearMocks: true,
// 	resetMocks: true,
// 	restoreMocks: true,
// 	transformIgnorePatterns: ['/node_modules/(?!(inquirer|log-update))/'],
// 	transform: {
// 		'\\.[jt]sx?$': ['esbuild-jest', { sourcemap: true }],
// 	},
// };
