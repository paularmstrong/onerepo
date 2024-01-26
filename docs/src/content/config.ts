import { z, defineCollection } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections: Record<string, ReturnType<typeof defineCollection>> = {
	docs: defineCollection({
		schema: docsSchema({
			extend: z.object({
				meta: z
					.object({
						stability: z.enum(['stable', 'unstable', 'preview', 'experimental']).optional(),
						version: z.string().optional(),
					})
					.optional(),
			}),
		}),
	}),
	i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
};
