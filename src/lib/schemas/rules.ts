import { z } from 'zod';

export const partNameRule = (schema: z.ZodString) => schema.max(128).min(1);
export const partQuantityRule = (schema: z.ZodNumber) => schema.max(4786).min(0);
