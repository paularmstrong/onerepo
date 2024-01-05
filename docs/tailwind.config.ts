import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
	content: ['src/**/*.{astro,md,mdx,tsx}', '../**/*.{mdx,md}', 'astro.config.ts'],
	darkMode: 'class',
	plugins: [
		typography,
		{
			handler: function ({ matchUtilities, theme }) {
				matchUtilities(
					{
						tab: (value) => ({
							tabSize: value,
						}),
					},
					{ values: theme('tabSize') },
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
					'pre > code[data-language]': {
						padding: theme('spacing.4'),
					},
					'[data-line-numbers]': {
						counterReset: 'line',
						'& [data-line]::before': {
							counterIncrement: 'line',
							content: 'counter(line)',
							display: 'inline-block',
							width: theme('width.5'),
							marginRight: theme('spacing.6'),
							textAlign: 'right',
							color: theme('colors.gray.400'),
						},
					},
					'[data-rehype-pretty-code-fragment]': {
						borderRadius: theme('borderRadius.md'),
						borderWidth: '1px',
						borderStyle: 'solid',
						borderColor: theme('colors.zinc.300'),
						backgroundColor: `${theme('colors.zinc.200')}88`,

						'.dark &': {
							borderColor: theme('colors.zinc.700'),
							backgroundColor: theme('colors.zinc.800'),
						},

						overflow: 'hidden',
						marginBottom: theme('spacing.4'),
						'> pre': {
							margin: '0',
							height: '100%',
						},
						'> pre > code': {
							backgroundColor: 'transparent',
							display: 'flex',
							flexDirection: 'column',
							border: '0',
							paddingLeft: '0',
							paddingRight: '0',
						},
					},
					'[data-rehype-pretty-code-title]': {
						width: 'max-content',
						borderTopLeftRadius: theme('borderRadius.md'),
						borderTopRightRadius: theme('borderRadius.md'),
						borderColor: theme('colors.zinc.300'),
						borderWidth: '1px',
						borderStyle: 'solid',
						borderBottomWidth: '0px',
						padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
						fontFamily: theme('fontFamily.mono'),
						color: theme('colors.zinc.800'),
						backgroundColor: theme('colors.zinc.100'),
						fontSize: theme('fontSize.xs'),
						marginLeft: '0.125rem',
						marginTop: '0.125rem',

						'.dark &': {
							color: theme('colors.zinc.100'),
							backgroundColor: theme('colors.zinc.700'),
							borderColor: theme('colors.zinc.600'),
						},

						'+ pre': {
							borderTopLeftRadius: theme('borderRadius.none'),
							borderTop: `1px solid ${theme('colors.zinc.300')}`,
							'.dark &': {
								borderTop: `1px solid ${theme('colors.zinc.600')}`,
							},
						},
					},
					'pre:hover > button': {
						opacity: '1',
					},
					'[data-theme="dark"]': {
						display: 'none',
					},
					'.dark': {
						'[data-theme="light"]': {
							display: 'none',
						},
						'[data-theme="dark"]': {
							display: 'block',
						},
					},
				});

				addComponents({
					'.logo': {
						backgroundSize: '200%',
						maskImage: 'url(/oneRepo.svg)',
						backgroundColor: 'currentcolor',
					},
					'.aurora': {
						transform: 'perspective(300px) rotateX(-10deg) rotateY(-9deg)',
					},
					'.dark .aurora-slice': {
						backgroundImage: `linear-gradient(
							0deg,
							rgba(219, 39, 119, 0) 0%,
							rgba(4, 182, 212, 0.5) 4%,
							rgba(4, 182, 212, 0.35) 8%,
							rgba(67, 183, 160, 0.3) 18%,
							rgba(219, 200, 219, 0.15) 20%,
							rgba(219, 39, 119, 0.4) 40%,
							rgba(219, 39, 119, 0) 100%
						)`,
					},
					'.aurora-slice': {
						willChange: 'transform',
						backgroundImage: `linear-gradient(
							0deg,
							rgba(219, 39, 119, 0) 0%,
							rgba(4, 182, 212, 0.8) 4%,
							rgba(4, 182, 212, 0.6) 5%,
							rgba(234, 242, 166, 0.75) 8%,
							rgba(67, 183, 160, 0.40) 12%,
							rgba(219, 200, 219, 0.65) 22%,
							rgba(219, 39, 119, 0.55) 40%,
							rgba(219, 39, 119, 0) 100%
						)`,
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
			animation: {},
			keyframes: {
				aurora: {
					'0%, 100%': {
						transform: 'translateY(0)',
					},
					'50%': {
						transform: 'translateY(10%)',
					},
				},
			},
			// @ts-ignore
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						'code::before': { content: '""' },
						'code::after': { content: '""' },
						// When typedoc-plugin-markdown links code elements, it's unclear that they're clickable
						'a > code::after': { content: '" 🔗"' },
						// code: { fontSize: 'inherit' },
					},
				},
				pink: {
					css: {
						'--tw-prose-body': theme('colors.gray.900'),
						'--tw-prose-headings': theme('colors.gray.900'),
						'--tw-prose-lead': theme('colors.pink.700'),
						'--tw-prose-links': theme('colors.cyan.600'),
						'--tw-prose-bold': theme('colors.pink.700'),
						'--tw-prose-counters': theme('colors.pink.600'),
						'--tw-prose-bullets': theme('colors.pink.400'),
						'--tw-prose-hr': theme('colors.pink.300'),
						'--tw-prose-quotes': theme('colors.pink.900'),
						'--tw-prose-quote-borders': theme('colors.pink.300'),
						'--tw-prose-captions': theme('colors.pink.700'),
						'--tw-prose-code': theme('colors.gray.700'),
						'--tw-prose-pre-code': theme('colors.gray.800'),
						'--tw-prose-pre-bg': theme('colors.zinc.100'),
						'--tw-prose-th-borders': theme('colors.gray.600'),
						'--tw-prose-td-borders': theme('colors.gray.700'),
						'--tw-prose-invert-body': theme('colors.white'),
						'--tw-prose-invert-headings': theme('colors.white'),
						'--tw-prose-invert-lead': theme('colors.pink.300'),
						'--tw-prose-invert-links': theme('colors.cyan.500'),
						'--tw-prose-invert-bold': theme('colors.pink.600'),
						'--tw-prose-invert-counters': theme('colors.pink.400'),
						'--tw-prose-invert-bullets': theme('colors.pink.600'),
						'--tw-prose-invert-hr': theme('colors.pink.700'),
						'--tw-prose-invert-quotes': theme('colors.pink.100'),
						'--tw-prose-invert-quote-borders': theme('colors.pink.700'),
						'--tw-prose-invert-captions': theme('colors.pink.400'),
						'--tw-prose-invert-code': theme('colors.zinc.700'),
						'--tw-prose-invert-pre-code': theme('colors.gray.100'),
						'--tw-prose-invert-pre-bg': theme('colors.zinc.900'),
						'--tw-prose-invert-th-borders': theme('colors.zinc.500'),
						'--tw-prose-invert-td-borders': theme('colors.zinc.400'),
					},
				},
			}),
		},
	},
} satisfies Config;
