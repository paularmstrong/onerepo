import { defineConfig } from 'astro/config';
// eslint-disable-next-line import/no-unresolved
import mdx from '@astrojs/mdx';
// eslint-disable-next-line import/no-unresolved
import tailwind from '@astrojs/tailwind';
import rehypePrettyCode from 'rehype-pretty-code';

/** @type {import('@astrojs/mdx').MdxOptions['rehypePlugins']} */
const rehypePlugins = [
	[
		rehypePrettyCode,
		{
			theme: { dark: 'github-dark', light: 'github-light' },
			// @ts-ignore implicit-any
			onVisitLine(node) {
				// Prevent lines from collapsing in `display: grid` mode, and
				// allow empty lines to be copy/pasted
				if (node.children.length === 0) {
					node.children = [{ type: 'text', value: ' ' }];
				}
				node.properties.className.push('inline-block', 'w-full', 'px-4', 'border-transparent');
			},
			// @ts-ignore implicit-any
			onVisitHighlightedLine(node) {
				node.properties.className.push('bg-pink-600/20');
			},
			// @ts-ignore implicit-any
			onVisitHighlightedWord(node) {
				node.properties.className = ['bg-pink-700/40', 'rounded', 'p-1', '-m-1'];
			},
		},
	],
];

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
	trailingSlash: 'always',
	integrations: [
		tailwind(),
		mdx({
			rehypePlugins,
		}),
	],
	markdown: {
		// @ts-ignore – disappointing
		rehypePlugins,
		syntaxHighlight: false,
		extendDefaultPlugins: true,
	},
});
