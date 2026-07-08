import { userSelectSchema } from '$lib/server/db/auth.zod.schema';
import {
	partInsertSchema,
	partSelectSchema,
	projectSelectSchema,
	stateSelectSchema
} from '$lib/server/schema.zod';
import { sqidInput } from '$lib/sqid';
import z from 'zod';

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

export const movePartSchema = z.object({
	partId: sqidInput,
	newStateId: sqidInput
});

export const archivePartSchema = z.object({
	partId: sqidInput
});
