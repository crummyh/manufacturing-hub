import { userSelectSchema } from '$lib/server/db/auth.zod.schema';
import {
	partInsertSchema,
	partSelectSchema,
	projectSelectSchema,
	stateSelectSchema
} from '$lib/server/db/schema.zod';
import { sqidInput } from '$lib/sqid';
import z from 'zod';
import { boolean } from 'zod';

const kanbanPartSchema = partSelectSchema.extend({
	assignee: userSelectSchema.optional().nullable(),
	project: projectSelectSchema.optional().nullable()
});

export const kanbanSelectSchema = stateSelectSchema
	.extend({
		parts: kanbanPartSchema.array()
	})
	.array();

export const projectsSelectSchema = projectSelectSchema.array();

export const newPartSchema = partInsertSchema.extend({
	critical: boolean().default(false),
	steps: sqidInput.array()
});

export type NewPart = z.infer<typeof newPartSchema>;
export type NewPartSchema = typeof newPartSchema;

export type Templates = {
	id: string;
	name: string;
	steps: {
		id: string;
		name: string;
	}[];
}[];

export const movePartSchema = z.object({
  partId: sqidInput,
  newStateId: sqidInput
})
