import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		order: z.number(),
		featured: z.boolean().default(false),
		role: z.string().optional(),
		timeframe: z.string().optional(),
		stack: z.array(z.string()).default([]),
		metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
		links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
	}),
});

export const collections = { projects };
