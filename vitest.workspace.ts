// eslint-disable-next-line import/no-extraneous-dependencies
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	'<rootDir>/config/vitest/*.config.js',
	'<rootDir>/modules/*/vitest.config.js',
	'<rootDir>/plugins/*/vitest.config.js',
	'<rootDir>/internal/*/vitest.config.js',
]);
