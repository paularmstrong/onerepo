/** @type {import('eslint').ESLint.Plugin} */
module.exports = {
	configs: {
		base: {
			// parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},

			env: {
				commonjs: false,
				es6: true,
			},

			plugins: ['import'],
			extends: ['eslint:recommended', 'plugin:tailwindcss/recommended', 'plugin:import/errors'],

			rules: {
				'no-console': 'error',
				'no-undef': 'off', // @typescript-eslint/no-unused-vars
				indent: 'off', // Prettier is used for this

				'tailwindcss/classnames-order': 'error',
				'tailwindcss/enforces-negative-arbitrary-values': 'error',
				'tailwindcss/enforces-shorthand': 'error',
				'tailwindcss/migration-from-tailwind-2': 'off',
				'tailwindcss/no-arbitrary-value': 'error',
				'tailwindcss/no-custom-classname': 'error',
				'tailwindcss/no-contradicting-classname': 'error',

				'import/no-cycle': ['error', { maxDepth: 2 }],
				'import/no-relative-packages': 'error',
				'import/no-extraneous-dependencies': [
					'error',
					{ devDependencies: ['**/*.test.ts', '**/*.config.js', '**/bin/*.cjs'] },
				],
			},

			settings: {
				tailwindcss: {
					callees: ['clsx', 'classnames'],
				},
				'import/resolver': {
					node: true,
				},
			},

			overrides: [
				{
					files: ['**/*.cjs'],
					env: { node: true, commonjs: true },
				},
				{
					parser: '@typescript-eslint/parser',
					files: ['*.tsx', '*.ts'],
					plugins: ['@typescript-eslint'],
					extends: ['plugin:@typescript-eslint/recommended', 'plugin:import/typescript'],
					rules: {
						'@typescript-eslint/ban-ts-comment': 'off', // sometimes you know what you're doing
						'@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
						'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
						'@typescript-eslint/no-empty-function': 'off',
						'@typescript-eslint/no-non-null-assertion': 'off',
						'@typescript-eslint/no-inferrable-types': 'off',
						'@typescript-eslint/no-var-requires': 'off',

						'@typescript-eslint/array-type': ['error', { default: 'generic', readonly: 'generic' }],
						'@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
					},
					settings: {
						react: {
							version: 'detect',
						},
						'import/resolver': {
							typescript: true,
							node: true,
						},
					},
				},
			],
		},
	},
};
