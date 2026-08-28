import { sqidInputClient } from '$lib/sqid';
import { z } from 'zod';

import { partNameRule, partQuantityRule } from '../rules';

export const partInsertSchemaClient = z.object({
	name: partNameRule(z.string()),
	quantity: partQuantityRule(z.number()),
	critical: z.boolean().default(false),
	assigneeId: sqidInputClient.optional().nullable(),
	projectId: sqidInputClient.optional().nullable()
});

export type PartInsertClient = z.infer<typeof partInsertSchemaClient>;
export type PartInsertSchemaClient = typeof partInsertSchemaClient;
