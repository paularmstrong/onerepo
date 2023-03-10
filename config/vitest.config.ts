import { mergeConfig } from 'vite';
import { defaultConfig } from '@internal/test-config';

export default mergeConfig(defaultConfig, {
	test: {},
});
