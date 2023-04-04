import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'vitest',
	rootDir: import.meta.url,
});

export default config;
