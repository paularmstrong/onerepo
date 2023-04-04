import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: 'subprocess',
	rootDir: import.meta.url,
});

export default config;
