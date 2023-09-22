import { makeConfig } from '@internal/jest-config';

const config = makeConfig({
	displayName: 'jest',
	rootDir: import.meta.url,
});

export default config;
