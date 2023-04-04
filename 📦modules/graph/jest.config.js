import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'graph',
	rootDir: import.meta.url,
});

export default config;
