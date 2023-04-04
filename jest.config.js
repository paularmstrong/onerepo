/** @type {import('jest').Config} */
export default {
	collectCoverageFrom: ['**/*.{ts,js}', '!**/node_modules/**'],
	projects: [
		'<rootDir>/config/jest/*.config.js',
		'<rootDir>/📦modules/*/jest.config.js',
		'<rootDir>/🧩plugins/*/jest.config.js',
		'<rootDir>/internal/*/jest.config.js',
	],
};
