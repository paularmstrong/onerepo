/** @type {import('jest').Config} */
export default {
	collectCoverageFrom: ['**/*.{ts,js}', '!**/node_modules/**'],
	projects: ['<rootDir>/modules/*/jest.config.js'],
};
