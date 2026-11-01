import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		order: z.number(),
		role: z.string().optional(),
		timeframe: z.string().optional(),
		stack: z.array(z.string()).default([]),
		metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
		// Large-format screenshot or video shown with the project on the home page. Files live in public/media/.
		media: z
			.object({
				type: z.enum(['image', 'video']),
				src: z.string(),
				alt: z.string(),
				poster: z.string().optional(),
				/** Shown under the frame, e.g. to note that a screenshot uses illustrative data. */
				caption: z.string().optional(),
			})
			.optional(),
		links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
	}),
});

export const collections = { projects };
