import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		projects: [
			'<rootDir>/commands/vitest.config.js',
			'<rootDir>/modules/*/vitest.config.js',
			'<rootDir>/plugins/*/vitest.config.js',
			'<rootDir>/internal/*/vitest.config.js',
		],
	},
});
