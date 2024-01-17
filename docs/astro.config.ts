import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import sitemap from '@astrojs/sitemap';
import starlightLinksValidator from 'starlight-links-validator';
import { rehypeAutolink } from './src/plugins/rehype-autolink';
import { mermaid } from './src/plugins/remark-mermaid';

export default defineConfig({
	trailingSlash: 'always',
	markdown: {
		remarkPlugins: [mermaid],
		rehypePlugins: [...rehypeAutolink()],
	},
	site: 'https://onerepo.tools',
	integrations: [
		sitemap({
			filter: (page) => page !== 'https://onerepo.tools/visualize/',
			serialize(item) {
				if (/\/concepts\//.test(item.url)) {
					return { ...item, priority: 0.7 };
				}
				if (/\/docs\//.test(item.url)) {
					return { ...item, priority: 0.9 };
				}
				if (/\/core\//.test(item.url)) {
					return { ...item, priority: 0.8 };
				}
				if (/\/plugins\//.test(item.url)) {
					return { ...item, priority: 0.5 };
				}
				if (/\/api\//.test(item.url)) {
					return { ...item, priority: 0.1 };
				}
				if (/\/changelogs\//.test(item.url)) {
					return { ...item, priority: 0.2 };
				}
				return item;
			},
		}),
		starlight({
			title: 'oneRepo',
			logo: {
				dark: './src/assets/logo-full-dark.svg',
				light: './src/assets/logo-full.svg',
				replacesTitle: true,
			},
			customCss: ['./src/custom.css'],
			social: {
				github: 'https://github.com/paularmstrong/onerepo',
			},
			sidebar: [
				{ label: 'Core concepts', autogenerate: { directory: 'concepts' } },
				{ label: 'Documentation', autogenerate: { directory: 'docs' } },
				{ label: 'Core utilities', autogenerate: { directory: 'core' } },
				{ label: 'Plugins', autogenerate: { directory: 'plugins' } },
				{ label: 'Project', autogenerate: { directory: 'project' } },
				{
					label: 'API Reference',
					collapsed: true,
					autogenerate: { directory: 'api', collapsed: false },
				},

				{
					label: 'Changelogs',
					collapsed: true,
					autogenerate: { directory: 'changelogs', collapsed: true },
				},
			],
			components: {
				Footer: './src/components/Footer.astro',
				PageTitle: './src/components/PageTitle.astro',
			},
			expressiveCode: {
				tabWidth: 2,
				styleOverrides: {
					borderRadius: '0.25rem',
				},
				plugins: [pluginCollapsibleSections(), starlightLinksValidator()],
			},
			lastUpdated: true,
			favicon: '/favicon.svg',
			editLink: {
				baseUrl: 'https://github.com/paularmstrong/onerepo/edit/main/',
			},
		}),
	],
});
