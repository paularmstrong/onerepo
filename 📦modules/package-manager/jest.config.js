import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'pkg-mgr',
	rootDir: import.meta.url,
});

export default config;
