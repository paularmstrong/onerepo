import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'onerepo',
	rootDir: import.meta.url,
});

export default config;
