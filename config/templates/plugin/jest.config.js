import { makeConfig } from '@internal/test-config';

const config = makeConfig({
	displayName: '<%= name %>',
	rootDir: import.meta.url,
});

export default config;
