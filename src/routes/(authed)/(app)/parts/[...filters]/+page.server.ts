// import { parseOverviewFilters, overviewFilterSchema } from '$lib/filter';
import { error, fail } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { basicNavButtonsData } from '$lib/server/db/queries';
import { part, state } from '$lib/server/db/schema';
// import { part, project, state, user } from '$lib/server/db/schema';
import { newPart } from '$lib/server/forms';
// import { projectSelectSchema } from '$lib/server/schema.zod';
import { getErrorMessage } from '$lib/utils';
import { eq } from 'drizzle-orm';
import z from 'zod';

import type { Actions, PageServerLoad } from './$types';

// import { eq, and, getTableColumns } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// let filters;

	try {
		// 	// Parse rest param for filters
		// 	filters = overviewFilterSchema.parse(parseOverviewFilters(params.filters));
		// } catch (e) {
		// 	error(400, getErrorMessage(e));
		// }

		// try {
		// 	// The set of conditions that can be checked against if filters are present
		// 	// This works because Drizzle skips undefined in `and` statements
		// 	const conditions = [
		// 		filters.project ? eq(part.projectId, filters.project) : undefined,
		// 		filters.assignee ? eq(part.assigneeId, filters.assignee) : undefined,
		// 		eq(part.archived, false)
		// 	];

		// 	// Get the parts that match the filters and attach their project and assignee info
		// 	const rows = await db
		// 		.select({
		// 			state: getTableColumns(state),
		// 			part: getTableColumns(part),
		// 			assignee: getTableColumns(user),
		// 			project: getTableColumns(project)
		// 		})
		// 		.from(state)
		// 		.leftJoin(part, and(eq(part.stateId, state.id), ...conditions))
		// 		.leftJoin(project, eq(part.projectId, project.id))
		// 		.leftJoin(user, eq(part.assigneeId, user.id));

		// 	// Get the project and assignee that are being filtered by (This might not be needed, or maybe just the id)
		// 	const filteredProject = filters.project
		// 		? projectSelectSchema.parse(
		// 				(await db.select().from(project).where(eq(project.id, filters.project)).limit(1))[0]
		// 			)
		// 		: undefined;

		// 	const filteredAssignee = filters.assignee
		// 		? projectSelectSchema.parse(
		// 				(await db.select().from(user).where(eq(user.id, filters.assignee)).limit(1))[0]
		// 			)
		// 		: undefined;

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
