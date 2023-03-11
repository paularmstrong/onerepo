import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'docgen',
	rootDir: import.meta.url,
});

export default config;
