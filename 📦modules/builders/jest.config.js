import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'builders',
	rootDir: import.meta.url,
});

export default config;
