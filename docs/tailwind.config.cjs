'use strict';

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['src/**/*.{astro,md,mdx,tsx}', '../**/*.{mdx,md}', 'astro.config.mjs'],
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
		{
			handler: function ({ addBase, addComponents, theme }) {
				addBase({
					'[id]': {
						position: 'relative',
						zIndex: '1',
					},
					'*:target::before': {
						content: '" "',
						position: 'absolute',
						backgroundColor: theme('colors.sky.400'),
						borderRadius: theme('borderRadius.DEFAULT'),
						opacity: '0.2',
						zIndex: '-1',
						inset: `-${theme('spacing.2')}`,
					},
					'[data-line-numbers]': {
						counterReset: 'line',
						'& .line::before': {
							counterIncrement: 'line',
							content: 'counter(line)',
							display: 'inline-block',
							width: theme('width.5'),
							marginRight: theme('spacing.6'),
							textAlign: 'right',
							color: theme('colors.slate.400'),
						},
					},
					'[data-rehype-pretty-code-fragment]': {
						backgroundColor: `${theme('colors.gray.800')}88`,
						border: `1px solid ${theme('colors.gray.700')}`,
						borderRadius: theme('borderRadius.md'),
						overflow: 'hidden',
						marginBottom: theme('spacing.4'),
						boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
						'> pre': {
							margin: '0',
							height: '100%',
						},
						'> pre > code': {
							display: 'flex',
							flexDirection: 'column',
						},
					},
					'[data-rehype-pretty-code-title]': {
						width: 'max-content',
						// borderTopLeftRadius: theme('borderRadius.md'),
						borderTopRightRadius: theme('borderRadius.md'),
						borderRight: `1px solid ${theme('colors.gray.700')}`,
						padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
						fontFamily: theme('fontFamily.mono'),
						color: theme('colors.gray.100'),
						backgroundColor: theme('colors.gray.800'),
						fontSize: theme('fontSize.xs'),

						'+ pre': {
							borderTopLeftRadius: theme('borderRadius.none'),
							borderTop: `1px solid ${theme('colors.gray.700')}`,
						},
					},
				});

				addComponents({
					'.logo': {
						backgroundSize: '200%',
						maskImage: 'url(/oneRepo.svg)',
					},
				});
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
			animation: {
				gradient: 'gradient 1.5s ease infinite',
			},
			keyframes: {
				gradient: {
					'0%, 100%': {
						backgroundPosition: '100% 0%',
					},
					'50%': {
						backgroundPosition: '0% 50%',
					},
				},
			},
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
						'--tw-prose-body': theme('colors.pink.50'),
						'--tw-prose-headings': theme('colors.pink.600'),
						'--tw-prose-lead': theme('colors.pink.700'),
						'--tw-prose-links': theme('colors.cyan.500'),
						'--tw-prose-bold': theme('colors.pink.700'),
						'--tw-prose-counters': theme('colors.pink.600'),
						'--tw-prose-bullets': theme('colors.pink.400'),
						'--tw-prose-hr': theme('colors.pink.300'),
						'--tw-prose-quotes': theme('colors.pink.900'),
						'--tw-prose-quote-borders': theme('colors.pink.300'),
						'--tw-prose-captions': theme('colors.pink.700'),
						'--tw-prose-code': theme('colors.pink.400'),
						'--tw-prose-pre-code': theme('colors.gray[100]'),
						'--tw-prose-pre-bg': theme('colors.gray[800]'),
						'--tw-prose-th-borders': theme('colors.pink.300'),
						'--tw-prose-td-borders': theme('colors.pink.200'),
						'--tw-prose-invert-body': theme('colors.pink.200'),
						'--tw-prose-invert-headings': theme('colors.white'),
						'--tw-prose-invert-lead': theme('colors.pink.300'),
						'--tw-prose-invert-links': theme('colors.white'),
						'--tw-prose-invert-bold': theme('colors.white'),
						'--tw-prose-invert-counters': theme('colors.pink.400'),
						'--tw-prose-invert-bullets': theme('colors.pink.600'),
						'--tw-prose-invert-hr': theme('colors.pink.700'),
						'--tw-prose-invert-quotes': theme('colors.pink.100'),
						'--tw-prose-invert-quote-borders': theme('colors.pink.700'),
						'--tw-prose-invert-captions': theme('colors.pink.400'),
						'--tw-prose-invert-code': theme('colors.white'),
						'--tw-prose-invert-pre-code': theme('colors.pink.300'),
						'--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
						'--tw-prose-invert-th-borders': theme('colors.pink.600'),
						'--tw-prose-invert-td-borders': theme('colors.pink.700'),
					},
				},
			}),
		},
	},
};
