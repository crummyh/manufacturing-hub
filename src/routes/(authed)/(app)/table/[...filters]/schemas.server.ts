import { userSelectSchema } from '$lib/server/db/auth.zod.schema';
import { partSelectSchema, projectSelectSchema, stateSelectSchema } from '$lib/server/schema.zod';
import type z from 'zod';

export const partData = partSelectSchema.extend({
	project: projectSelectSchema.optional().nullable(),
	state: stateSelectSchema.optional().nullable(),
	assignee: userSelectSchema.optional().nullable()
});
export type PartData = z.infer<typeof partData>;
