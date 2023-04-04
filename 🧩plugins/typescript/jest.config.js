import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'typescript',
	rootDir: import.meta.url,
});

export default config;
