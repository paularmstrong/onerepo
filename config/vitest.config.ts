import { mergeConfig } from 'vite';
import { defaultConfig } from '@onerepo/vitest';

export default mergeConfig(defaultConfig, {
	test: {},
});
