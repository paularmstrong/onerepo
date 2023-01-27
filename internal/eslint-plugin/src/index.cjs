/** @type {import('eslint').ESLint.Plugin} */
module.exports = {
	configs: {
		base: {
			parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},

			env: {
				commonjs: false,
				es6: true,
			},

			plugins: ['@typescript-eslint'],
			extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],

			rules: {
				'no-console': 'error',
				'no-undef': 'off', // @typescript-eslint/no-unused-vars
				indent: 'off', // Prettier is used for this

				'@typescript-eslint/ban-ts-comment': 'off', // sometimes you know what you're doing
				'@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
				'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
				'@typescript-eslint/no-empty-function': 'off',
				'@typescript-eslint/no-non-null-assertion': 'off',
				'@typescript-eslint/no-inferrable-types': 'off',
				'@typescript-eslint/no-var-requires': 'off',
			},

			overrides: [
				{
					files: ['**/*.cjs'],
					env: { node: true, commonjs: true },
				},
				{
					files: ['**/*.tsx'],
					plugins: ['react', 'react-hooks'],
					extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
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
