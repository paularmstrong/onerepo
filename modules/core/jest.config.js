import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'core',
	rootDir: import.meta.url,
});

export default config;
