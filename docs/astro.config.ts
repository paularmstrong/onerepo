import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
// import starlightLinksValidator from 'starlight-links-validator';
import astroMetaTags from 'astro-meta-tags';
import { rehypeAutolink } from './src/plugins/rehype-autolink';
import { mermaid } from './src/plugins/remark-mermaid';

export default defineConfig({
	trailingSlash: 'always',
	markdown: {
		remarkPlugins: [mermaid],
		rehypePlugins: [...rehypeAutolink()],
	},
	site: 'https://onerepo.tools',
	devToolbar: {
		enabled: true,
	},
	integrations: [
		starlight({
			title: 'oneRepo',
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
			},
			logo: {
				dark: './src/assets/logo-full-dark.svg',
				light: './src/assets/logo-full-dark.svg',
				replacesTitle: true,
			},
			customCss: ['./src/custom.css'],
			social: {
				github: 'https://github.com/paularmstrong/onerepo',
				discord: 'https://onerepo.tools/discord/',
			},
			titleDelimiter: '🚀',
			sidebar: [
				{ label: 'Core concepts', autogenerate: { directory: 'concepts' } },
				{ label: 'Documentation', autogenerate: { directory: 'docs' } },
				{ label: 'Core commands', autogenerate: { directory: 'core' } },
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
			plugins: [
				// starlightLinksValidator({
				// 	errorOnRelativeLinks: false,
				// }),
			],
			components: {
				Footer: './src/components/Footer.astro',
				Head: './src/components/Head.astro',
				PageFrame: './src/components/PageFrame.astro',
				PageTitle: './src/components/PageTitle.astro',
			},
			expressiveCode: {
				defaultProps: {
					wrap: true,
					overridesByLang: {
						'bash,ps,sh': { preserveIndent: false },
					},
				},
				tabWidth: 2,
				styleOverrides: {
					borderRadius: '0.25rem',
					codeLineHeight: '1.25',
					codePaddingInline: '1.25rem',
				},
				plugins: [pluginCollapsibleSections()],
			},
			lastUpdated: true,
			favicon: '/favicon.svg',
			editLink: {
				baseUrl: 'https://github.com/paularmstrong/onerepo/edit/main/docs',
			},
		}),
		astroMetaTags(),
	],
});
