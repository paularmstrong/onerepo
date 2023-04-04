import { z, defineCollection } from 'astro:content';

export const collections = {
	core: defineCollection({
		schema: z.object({
			title: z.string(),
			usage: z.string().optional(),
		}),
	}),
	plugins: defineCollection({
		schema: z.object({
			title: z.string(),
			tool: z.string(),
			description: z.string(),
			shortname: z.string(),
			version: z.string(),
		}),
	}),
	changelogs: defineCollection({
		schema: z.object({
			title: z.string(),
			description: z.string(),
		}),
	}),
};
