import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'prettier',
	rootDir: import.meta.url,
});

export default config;
