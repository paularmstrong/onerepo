import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const collectionEntries = await getCollection('docs');
const pages = Object.fromEntries(collectionEntries.map(({ id, data }: { id: string; data: unknown }) => [id, data]));

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
