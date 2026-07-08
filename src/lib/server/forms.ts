import { sqidInput } from '$lib/sqid';
import { requireUser } from './auth';
import { db } from './db';
import { getFirstState } from './db/queries';
import { part, partStep } from './db/schema';
import { partInsertSchema } from './schema.zod';
import { fail, type Action } from '@sveltejs/kit';
import { generateNKeysBetween } from 'fractional-indexing';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import z, { boolean } from 'zod';

export const newPartSchema = partInsertSchema.extend({
	critical: boolean().default(false),
	steps: sqidInput.array()
});

export type NewPart = z.infer<typeof newPartSchema>;
export type NewPartSchema = typeof newPartSchema;

export const newPart: Action = async (event) => {
	requireUser(event.locals, event.url.pathname);

	const form = await superValidate(event, zod4(newPartSchema));

	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	// Needed to assign state
	const firstState = await getFirstState();

	// Add the part
	const newPart = await db
		.insert(part)
		.values({
			name: form.data.name,
			quantity: form.data.quantity,
			critical: form.data.critical,
			projectId: form.data.projectId,
			stateId: firstState.id
		})
		.returning();

	// Generate initial ordering for PartSteps
	const orders = generateNKeysBetween(null, null, form.data.steps.length);

	// Add a PartStep for each step
	form.data.steps.forEach((step, i) => {
		db.insert(partStep).values({
			partId: newPart.id,
			stepId: step,
			order: orders[i]
		});
	});

	return {
		form
	};
};
