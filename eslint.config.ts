import tseslint from 'typescript-eslint';
import { rootConfig } from '@internal/eslint-plugin';

export default tseslint.config(
	{
		ignores: [
			'**/dist',
			'**/.yarn',
			'*.tsbuildinfo',
			/* TODO: sentinel for ignores */
		],
	},
	rootConfig,
);
