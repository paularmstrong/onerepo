import { defineConfig } from 'vitest/config';

export const defaultConfig = defineConfig({
	test: {
		globals: true,
		restoreMocks: true,
		watch: false,
	},
});
