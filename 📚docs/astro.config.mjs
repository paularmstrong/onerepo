// @ts-nocheck
import { defineConfig } from 'astro/config';
// eslint-disable-next-line import/no-unresolved
import mdx from '@astrojs/mdx';
// eslint-disable-next-line import/no-unresolved
import tailwind from '@astrojs/tailwind';
import rehypePrettyCode from 'rehype-pretty-code';

const rehypePlugins = [
	[
		rehypePrettyCode,
		{
			theme: { dark: 'github-dark', light: 'github-light' },
			onVisitLine(node) {
				// Prevent lines from collapsing in `display: grid` mode, and
				// allow empty lines to be copy/pasted
				if (node.children.length === 0) {
					node.children = [{ type: 'text', value: ' ' }];
				}
				node.properties.className.push('inline-block', 'w-full', 'px-4', 'border-transparent');
			},
			onVisitHighlightedLine(node) {
				node.properties.className.push('bg-pink-600/20');
			},
			onVisitHighlightedWord(node) {
				node.properties.className = ['bg-pink-700/40', 'rounded', 'p-1', '-m-1'];
			},
		},
	],
];

export default defineConfig({
	trailingSlash: 'always',
	integrations: [
		tailwind(),
		mdx({
			rehypePlugins,
		}),
	],
	markdown: {
		rehypePlugins,
		syntaxHighlight: false,
		extendDefaultPlugins: true,
	},
});
