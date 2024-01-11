/** @type import('prettier').Config */
module.exports = {
	plugins: [require.resolve('prettier-plugin-astro')],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
	printWidth: 120,
	singleQuote: true,
	useTabs: true,
};
