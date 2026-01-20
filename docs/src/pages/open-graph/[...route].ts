import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const collectionEntries = await getCollection('docs');
const pages = Object.fromEntries(
	collectionEntries.map(({ id, data }: { id: string; data: unknown }) => [id, data]),
) as Record<string, { title: string; description: string }>;

export const { getStaticPaths, GET } = await OGImageRoute<{ title: string; description: string }>({
	param: 'route',
	pages,
	getImageOptions: (_path, page) => ({
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
