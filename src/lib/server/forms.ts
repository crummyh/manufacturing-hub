import { fail, type Action } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateNKeysBetween } from 'fractional-indexing';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import z, { boolean } from 'zod';

import { requireUser } from './auth';
import { db } from './db';
import { getFirstState } from './db/queries';
import { part, partStep } from './db/schema';
import { partInsertSchema } from './schema.zod';

export const newPartSchema = partInsertSchema.extend({
	critical: boolean().default(false),
	steps: z.nanoid().array()
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
	const newPart =
		(
			await db
				.insert(part)
				.values({
					name: form.data.name,
					quantity: form.data.quantity,
					critical: form.data.critical,
					projectId: form.data.projectId,
					stateId: firstState.id
				})
				.returning()
		)[0] ?? null;

	// Generate initial ordering for PartSteps
	const orders = generateNKeysBetween(null, null, form.data.steps.length);

	let firstStepId = null;

	// Add a PartStep for each step
	for (let i = 0; i < form.data.steps.length; i++) {
		const createdPartStep = await db
			.insert(partStep)
			.values({
				partId: newPart.id,
				stepId: form.data.steps[i],
				order: orders[i]
			})
			.returning();

		if (i === 0) {
			firstStepId = createdPartStep[0].id ?? null;
		}
	}

	// Set the first step
	await db
		.update(part)
		.set({
			currentStepId: firstStepId
		})
		.where(eq(part.id, newPart.id));

	return {
		form
	};
};
