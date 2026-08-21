import { parseOverviewFilters, overviewFilterSchema } from '$lib/filter';
import { db } from '$lib/server/db';
import { basicNavButtonsData } from '$lib/server/db/queries';
import { part, project, state, user } from '$lib/server/db/schema';
import { newPart } from '$lib/server/forms';
import { projectSelectSchema } from '$lib/server/schema.zod';
import { getErrorMessage } from '$lib/utils';
import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { eq, and, getTableColumns } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	let filters;

	try {
		// Parse rest param for filters
		filters = overviewFilterSchema.parse(parseOverviewFilters(params.filters));
	} catch (e) {
		error(400, getErrorMessage(e));
	}

	try {
		// The set of conditions that can be checked against if filters are present
		// This works because Drizzle skips undefined in `and` statements
		const conditions = [
			filters.project ? eq(part.projectId, filters.project) : undefined,
			filters.assignee ? eq(part.assigneeId, filters.assignee) : undefined,
			eq(part.archived, false)
		];

		// Get the parts that match the filters and attach their project and assignee info
		const rows = await db
			.select({
				state: getTableColumns(state),
				part: getTableColumns(part),
				assignee: getTableColumns(user),
				project: getTableColumns(project)
			})
			.from(state)
			.leftJoin(part, and(eq(part.stateId, state.id), ...conditions))
			.leftJoin(project, eq(part.projectId, project.id))
			.leftJoin(user, eq(part.assigneeId, user.id));

		// Get the project and assignee that are being filtered by (This might not be needed, or maybe just the id)
		const filteredProject = filters.project
			? projectSelectSchema.parse(
					(await db.select().from(project).where(eq(project.id, filters.project)).limit(1))[0]
				)
			: undefined;

		const filteredAssignee = filters.assignee
			? projectSelectSchema.parse(
					(await db.select().from(user).where(eq(user.id, filters.assignee)).limit(1))[0]
				)
			: undefined;

		const navButtonsData = await basicNavButtonsData();

		return {
			filteredProject,
			filteredAssignee,
			...navButtonsData
		};
	} catch (e) {
		console.error(getErrorMessage(e));
		error(500, 'Failed to query database');
	}
};

export const actions: Actions = {
	newPart: newPart
};
