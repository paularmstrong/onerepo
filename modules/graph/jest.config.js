import { makeConfig } from '@internal/jest-config';

const config = makeConfig({
	displayName: 'graph',
	rootDir: import.meta.url,
});

export default config;
