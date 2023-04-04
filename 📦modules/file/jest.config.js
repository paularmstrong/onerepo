import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'file',
	rootDir: import.meta.url,
});

export default config;
