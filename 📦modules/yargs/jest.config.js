import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'yargs',
	rootDir: import.meta.url,
});

export default config;
