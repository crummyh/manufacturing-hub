import { db } from '.';
import { state } from './schema';
import { stepSelectSchema, templateSelectSchema } from './schema.zod';
import type z from 'zod';

export const templatesSchema = templateSelectSchema
	.extend({
		steps: stepSelectSchema.array()
	})
	.array();
export type Templates = z.infer<typeof templatesSchema>;

export async function getTemplatesWithSteps() {
	const results = await db.query.template.findMany({
		with: {
			templateSteps: {
				with: {
					step: true
				}
			}
		}
	});

	const templates = results.map((template) => ({
		id: template.id,
		name: template.name,
		steps: template.templateSteps.map(({ step }) => ({
			id: step.id,
			name: step.name
		}))
	}));

	return templatesSchema.parse(templates);
}

export async function getFirstState() {
	const value = await db.select().from(state).orderBy(state.order).limit(1);

	if (value.length !== 1) throw new Error('No states');

	return value[0]; // limit(1) still returns an array
}
