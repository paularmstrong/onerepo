import tseslint from 'typescript-eslint';
import { rootConfig } from '@internal/eslint-plugin';

// start-synced-imports
import docs from "@onerepo/docs/eslint.config";
// end-synced-imports

export default tseslint.config(
	{ ignores: ['**/dist', '**/.yarn', '*.tsbuildinfo'] },
	rootConfig,
	// start-synced-workspaces
	{ files: ['./docs/**'], extends: [...docs] },

	// end-synced-workspaces
);
