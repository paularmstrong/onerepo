import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'eslint',
	rootDir: import.meta.url,
});

export default config;
