import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';

export const rootConfig = tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	pluginImport.flatConfigs.errors,
	{
		rules: {
			'no-console': 'error',
			'no-undef': 'off', // @typescript-eslint/no-unused-vars
			indent: 'off', // Prettier is used for this
			'global-require': 'error',
			'no-mixed-spaces-and-tabs': 'off', // Prettier

			'import/first': 'error',
			'import/no-cycle': ['error', { maxDepth: 2 }],
			'import/no-relative-packages': 'error',
			'import/no-extraneous-dependencies': [
				'error',
				{ devDependencies: ['**/*.test.ts', '**/commands/*', '**/*.config.*', 'vitest.*'] },
			],
			'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
			'import/newline-after-import': 'error',
			'import/no-duplicates': ['error', { 'prefer-inline': false }],
			'import/order': [
				'error',
				{
					pathGroups: [{ pattern: 'react', group: 'builtin', position: 'before' }],
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
				},
			],

			'@typescript-eslint/ban-ts-comment': 'off', // sometimes you know what you're doing
			'@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ prefer: 'type-imports', disallowTypeAnnotations: false },
			],
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/array-type': ['error', { default: 'generic', readonly: 'generic' }],
			'@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
			'@typescript-eslint/no-invalid-void-type': 'off',
			'@typescript-eslint/no-dynamic-delete': 'off',
		},
		settings: {
			'import/resolver': {
				node: true,
				typescript: true,
			},
		},
	},
);
