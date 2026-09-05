import { error, fail } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { basicNavButtonsData } from '$lib/server/db/queries';
import { part, state } from '$lib/server/db/schema';
import { newPart } from '$lib/server/forms';
import { getErrorMessage } from '$lib/utils';
import { eq } from 'drizzle-orm';
import z from 'zod';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const parts = await db.query.part.findMany({
			orderBy: (t, { desc }) => desc(t.name),
			columns: {
				id: true,
				name: true,
				quantity: true,
				critical: true,
				archived: true
			},
			with: {
				project: {
					columns: {
						name: true,
						id: true
					}
				},
				state: {
					columns: {
						name: true,
						id: true
					}
				},
				assignee: {
					columns: {
						name: true,
						id: true,
						image: true
					}
				},
				currentStep: {
					columns: {},
					with: {
						step: {
							columns: {
								name: true
							}
						}
					}
				}
			}
		});

		const states = await db
			.select({
				id: state.id,
				name: state.name
			})
			.from(state)
			.orderBy(state.order);

		return {
			parts,
			states,
			navData: basicNavButtonsData()
		};
	} catch (e) {
		console.error(getErrorMessage(e));
		error(500, 'Failed to query database');
	}
};

const setStateSchema = z.object({
	partId: z.nanoid(),
	newStateId: z.nanoid()
});

export const actions: Actions = {
	newPart: newPart,

	setState: async ({ locals, request }) => {
		requireUser(locals);

		// Workaround for formdata
		const formData = Object.fromEntries((await request.formData()).entries());
		const { data, error } = setStateSchema.safeParse(formData);
		if (error) {
			return fail(400, error.message);
		}

		try {
			await db
				.update(part)
				.set({
					stateId: data.newStateId
				})
				.where(eq(part.id, data.partId));
		} catch (e) {
			const msg = getErrorMessage(e);
			return fail(500, msg);
		}

		return { success: true };
	}
};
