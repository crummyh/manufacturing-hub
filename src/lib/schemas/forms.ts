import { sqidInputClient } from '$lib/sqid';
import { partInsertSchemaClient } from './client/part';
import type z from 'zod';

export const newPartSchemaClient = partInsertSchemaClient.extend({
	steps: sqidInputClient.array()
});

export type NewPartClient = z.infer<typeof newPartSchemaClient>;
export type NewPartSchemaClient = typeof newPartSchemaClient;
