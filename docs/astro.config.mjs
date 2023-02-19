import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import rehypePrettyCode from 'rehype-pretty-code';

/** @type {import('@astrojs/mdx').MdxOptions['rehypePlugins']} */
const rehypePlugins = [
	[
		rehypePrettyCode,
		{
			theme: 'monokai',
			// @ts-ignore implicit-any
			onVisitLine(node) {
				// Prevent lines from collapsing in `display: grid` mode, and
				// allow empty lines to be copy/pasted
				if (node.children.length === 0) {
					node.children = [{ type: 'text', value: ' ' }];
				}
				node.properties.className.push('inline-block', 'w-full', 'border-l-4', 'px-4', 'border-transparent');
			},
			// @ts-ignore implicit-any
			onVisitHighlightedLine(node) {
				node.properties.className.push('bg-pink-600/20', 'border-l-pink-500/80');
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
