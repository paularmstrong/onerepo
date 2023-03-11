import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'jest',
	rootDir: import.meta.url,
});

export default config;
