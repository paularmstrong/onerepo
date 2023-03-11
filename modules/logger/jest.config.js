import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'logger',
	rootDir: import.meta.url,
});

export default config;
