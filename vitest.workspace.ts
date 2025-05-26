 
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	'<rootDir>/commands/vitest.config.js',
	'<rootDir>/modules/*/vitest.config.js',
	'<rootDir>/plugins/*/vitest.config.js',
	'<rootDir>/internal/*/vitest.config.js',
]);
