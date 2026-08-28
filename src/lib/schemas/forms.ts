import { sqidInputClient } from '$lib/sqid';
import type z from 'zod';

import { partInsertSchemaClient } from './client/part';

export const newPartSchemaClient = partInsertSchemaClient.extend({
	steps: sqidInputClient.array()
});

export type NewPartClient = z.infer<typeof newPartSchemaClient>;
export type NewPartSchemaClient = typeof newPartSchemaClient;
