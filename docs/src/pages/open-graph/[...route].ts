import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const collectionEntries = await getCollection('docs');
const pages = Object.fromEntries(collectionEntries.map(({ slug, data }) => [slug, data]));

export const { getStaticPaths, GET } = OGImageRoute({
	param: 'route',
	pages,
	getImageOptions: (path, page) => ({
		title: page.title,
		description: page.description,
		logo: {
			path: './src/assets/og-logo.png',
		},
		bgImage: {
			path: './src/assets/og-background.png',
			fit: 'cover',
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
