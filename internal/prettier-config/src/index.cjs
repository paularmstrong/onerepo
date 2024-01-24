/** @type import('prettier').Config */
module.exports = {
	plugins: [require.resolve('prettier-plugin-astro')],
	printWidth: 120,
	singleQuote: true,
	useTabs: true,

	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
		{
			files: ['*.mdx'],
			options: {
				printWidth: 80,
			},
		},
	],
};
