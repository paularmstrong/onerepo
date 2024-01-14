import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { mermaid } from './src/plugins/mermaid';

export default defineConfig({
	trailingSlash: 'always',
	markdown: {
		remarkPlugins: [mermaid],
	},
	integrations: [
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
				discord: 'https://onerepo.tools/discord/',
			},
			sidebar: [
				{ label: 'Core concepts', autogenerate: { directory: 'concepts' } },
				{ label: 'Documentation', autogenerate: { directory: 'docs' } },
				{ label: 'Core utilities', autogenerate: { directory: 'core' } },
				{ label: 'Plugins', autogenerate: { directory: 'plugins' } },
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
				plugins: [pluginCollapsibleSections()],
			},
			lastUpdated: true,
			favicon: '/favicon.svg',
			editLink: {
				baseUrl: 'https://github.com/paularmstrong/onerepo/edit/main/',
			},
		}),
	],
});
