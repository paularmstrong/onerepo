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

			extends: ['eslint:recommended', 'plugin:tailwindcss/recommended'],

			rules: {
				'no-console': 'error',
				'no-undef': 'off', // @typescript-eslint/no-unused-vars
				indent: 'off', // Prettier is used for this

				'tailwindcss/classnames-order': 'error',
				'tailwindcss/enforces-negative-arbitrary-values': 'error',
				'tailwindcss/enforces-shorthand': 'error',
				'tailwindcss/migration-from-tailwind-2': 'error',
				'tailwindcss/no-arbitrary-value': 'error',
				'tailwindcss/no-custom-classname': 'error',
				'tailwindcss/no-contradicting-classname': 'error',
			},

			settings: {
				tailwindcss: {
					callees: ['clsx', 'classnames'],
				},
			},

			overrides: [
				{
					files: ['**/*.cjs'],
					env: { node: true, commonjs: true },
				},
				{
					files: ['*.tsx', '*.ts'],
					parser: '@typescript-eslint/parser',
					plugins: ['react', 'react-hooks', '@typescript-eslint'],
					extends: [
						'plugin:react/recommended',
						'plugin:react-hooks/recommended',
						'plugin:@typescript-eslint/recommended',
					],
					rules: {
						'@typescript-eslint/ban-ts-comment': 'off', // sometimes you know what you're doing
						'@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
						'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
						'@typescript-eslint/no-empty-function': 'off',
						'@typescript-eslint/no-non-null-assertion': 'off',
						'@typescript-eslint/no-inferrable-types': 'off',
						'@typescript-eslint/no-var-requires': 'off',
					},
					settings: {
						react: {
							version: 'detect',
						},
					},
				},
			],
		},
	},
};
