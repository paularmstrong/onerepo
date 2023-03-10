/** @type {import('jest').Config} */
export default {
	projects: [
		'<rootDir>/modules/*/jest.config.js',
		'<rootDir>/plugins/*/jest.config.js',
		'<rootDir>/internal/*/jest.config.js',
	],
};
