import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'git',
	rootDir: import.meta.url,
});

export default config;
