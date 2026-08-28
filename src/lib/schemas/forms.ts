import z from 'zod';

import { partInsertSchemaClient } from './client/part';

export const newPartSchemaClient = partInsertSchemaClient.extend({
	steps: z.nanoid().array()
});

export type NewPartClient = z.infer<typeof newPartSchemaClient>;
export type NewPartSchemaClient = typeof newPartSchemaClient;
