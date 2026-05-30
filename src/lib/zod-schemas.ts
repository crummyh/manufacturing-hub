import z from 'zod';

export const manualPartSchema = z.object({
	name: z.string().min(1),
	quantity: z.int().max(32767).default(1),
	thickness: z.optional(z.int()),
	material: z.optional(z.int()),
	finish: z.optional(z.int()),
	critical: z.boolean()
});

export type ManualPartSchema = typeof manualPartSchema;

export const onshapePartSchema = z.object({
	name: z.string().min(1),
	quantity: z.int().max(32767).default(1),
	thickness: z.optional(z.int()),
	material: z.optional(z.int()),
	finish: z.optional(z.int()),
	critical: z.boolean()
});

export type OnshapePartSchema = typeof onshapePartSchema;
