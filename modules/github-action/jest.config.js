import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'github-action',
	rootDir: import.meta.url,
});

export default config;
