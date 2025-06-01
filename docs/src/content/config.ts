import { z, defineCollection } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { docsLoader } from '@astrojs/starlight/loaders';

export const collections: Record<string, ReturnType<typeof defineCollection>> = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				meta: z
					.object({
						stability: z.enum(['stable', 'unstable', 'preview', 'experimental', 'deprecated']).optional(),
						version: z.string().optional(),
					})
					.optional(),
			}),
		}),
	}),
	i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
};
