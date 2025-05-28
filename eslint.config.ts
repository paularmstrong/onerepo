import tseslint from 'typescript-eslint';
import { rootConfig } from '@internal/eslint-plugin';
import onerepoEslint from '@onerepo/plugin-eslint/config';

export default onerepoEslint(
	tseslint.config(
		{
			ignores: ['**/dist', '**/fixtures', '**/.yarn', '*.tsbuildinfo'],
		},
		rootConfig,
	),
);
