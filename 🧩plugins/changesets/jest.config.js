import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'changesets',
	rootDir: import.meta.url,
});

export default config;
