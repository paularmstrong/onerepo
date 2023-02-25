import { mergeConfig } from 'vite';
import { defaultConfig } from '@internal/vitest';

export default mergeConfig(defaultConfig, {
	test: {},
});
