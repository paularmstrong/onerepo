'use strict';

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['src/**/*.{astro,md,mdx,tsx}', 'blog/**/*.{md,mdx}', 'labs/**/*.{mdx,tsx,ts}', 'astro.config.mjs'],
	darkMode: 'media',
	plugins: [
		require('@tailwindcss/typography'),
		{
			handler: function ({ matchUtilities, theme }) {
				matchUtilities(
					{
						tab: (value) => ({
							tabSize: value,
						}),
					},
					{ values: theme('tabSize') }
				);
			},
		},
	],
	theme: {
		tabSize: {
			1: '1',
			2: '2',
			4: '4',
			8: '8',
		},
		extend: {
			// @ts-ignore
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						'code::before': { content: '""' },
						'code::after': { content: '""' },
					},
				},
				pink: {
					css: {
						'--tw-prose-body': theme('colors.pink[100]'),
						'--tw-prose-headings': theme('colors.pink[600]'),
						'--tw-prose-lead': theme('colors.pink[700]'),
						'--tw-prose-links': theme('colors.cyan[500]'),
						'--tw-prose-bold': theme('colors.pink[900]'),
						'--tw-prose-counters': theme('colors.pink[600]'),
						'--tw-prose-bullets': theme('colors.pink[400]'),
						'--tw-prose-hr': theme('colors.pink[300]'),
						'--tw-prose-quotes': theme('colors.pink[900]'),
						'--tw-prose-quote-borders': theme('colors.pink[300]'),
						'--tw-prose-captions': theme('colors.pink[700]'),
						'--tw-prose-code': theme('colors.pink[700]'),
						'--tw-prose-pre-code': theme('colors.pink[100]'),
						'--tw-prose-pre-bg': theme('colors.pink[900]'),
						'--tw-prose-th-borders': theme('colors.pink[300]'),
						'--tw-prose-td-borders': theme('colors.pink[200]'),
						'--tw-prose-invert-body': theme('colors.pink[200]'),
						'--tw-prose-invert-headings': theme('colors.white'),
						'--tw-prose-invert-lead': theme('colors.pink[300]'),
						'--tw-prose-invert-links': theme('colors.white'),
						'--tw-prose-invert-bold': theme('colors.white'),
						'--tw-prose-invert-counters': theme('colors.pink[400]'),
						'--tw-prose-invert-bullets': theme('colors.pink[600]'),
						'--tw-prose-invert-hr': theme('colors.pink[700]'),
						'--tw-prose-invert-quotes': theme('colors.pink[100]'),
						'--tw-prose-invert-quote-borders': theme('colors.pink[700]'),
						'--tw-prose-invert-captions': theme('colors.pink[400]'),
						'--tw-prose-invert-code': theme('colors.white'),
						'--tw-prose-invert-pre-code': theme('colors.pink[300]'),
						'--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
						'--tw-prose-invert-th-borders': theme('colors.pink[600]'),
						'--tw-prose-invert-td-borders': theme('colors.pink[700]'),
					},
				},
			}),
		},
	},
};
