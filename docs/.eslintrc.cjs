const path = require('path');

module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		extraFileExtensions: ['.astro'],
	},
	plugins: ['eslint-plugin-astro', 'import'],
	extends: ['plugin:astro/recommended'],

	rules: {
		'import/no-unresolved': ['error', { ignore: ['astro:*'] }],
		'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
	},

	settings: {
		tailwindcss: {
			config: path.join(__dirname, '/tailwind.config.ts'),
		},
	},

	overrides: [
		{
			files: ['*.astro'],
			parser: 'astro-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
		},
	],
};
