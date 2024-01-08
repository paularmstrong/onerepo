import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	trailingSlash: 'always',
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
			},
			sidebar: [
				{
					label: 'Guides',
					autogenerate: { directory: 'guides' },
				},
				{
					label: 'Commands',
					autogenerate: { directory: 'core' },
				},
				{
					label: 'Plugins',
					autogenerate: { directory: 'plugins' },
				},
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
			lastUpdated: true,
			favicon: '/favicon.svg',
			editLink: {
				baseUrl: 'https://github.com/paularmstrong/onerepo/edit/main/',
			},
		}),
	],
});
