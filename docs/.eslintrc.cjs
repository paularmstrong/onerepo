const path = require('path');

module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		extraFileExtensions: ['.astro'],
	},
	plugins: ['eslint-plugin-astro'],
	extends: ['plugin:astro/recommended'],
	settings: {
		tailwindcss: {
			config: path.join(__dirname, '/tailwind.config.cjs'),
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
