import { makeConfig } from '@internal/jest-config';

const config = makeConfig({
	displayName: 'logger',
	rootDir: import.meta.url,
});

export default config;
