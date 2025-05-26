import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const collectionEntries = await getCollection('docs');
const pages = Object.fromEntries(
	// @ts-ignore TODO: this was working…
	collectionEntries.map(({ slug, data }: { slug: string; data: unknown }) => [slug, data]),
);

export const { getStaticPaths, GET } = OGImageRoute({
	param: 'route',
	pages,
	getImageOptions: (path, page) => ({
		title: page.title,
		description: page.description,
		logo: {
			// This is actually transparent
			// The logo is embedded in the BG image to control positioning
			path: './src/assets/og-logo.png',
		},
		bgImage: {
			path: './src/assets/og-background.png',
			fit: 'none',
		},
		font: {
			title: {
				weight: 'Black',
			},
			description: {
				weight: 'Medium',
				size: 32,
			},
		},
	}),
});
