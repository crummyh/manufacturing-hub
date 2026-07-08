import { parseOverviewFilters, overviewFilterSchema } from '$lib/filter';
import { requireUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { getTemplatesWithSteps } from '$lib/server/db/queries';
import { part, project, state, step, user } from '$lib/server/db/schema';
import { newPart, newPartSchema } from '$lib/server/forms';
import { projectSelectSchema, stepSelectSchema } from '$lib/server/schema.zod';
import { getErrorMessage } from '$lib/utils';
import type { PageServerLoad, Actions } from './$types';
import {
	archivePartSchema,
	kanbanSelectSchema,
	movePartSchema,
	projectsSelectSchema
} from './schemas.server';
import { error, fail } from '@sveltejs/kit';
import { eq, and, getTableColumns } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

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

		// Group flat rows into nested states -> parts[]
		const statesMap = new Map<number, typeof state.$inferSelect & { parts: unknown[] }>();

		for (const row of rows) {
			if (!statesMap.has(row.state.id)) {
				statesMap.set(row.state.id, { ...row.state, parts: [] });
			}

			if (row.part) {
				statesMap.get(row.state.id)!.parts.push({
					...row.part,
					assignee: row.assignee,
					project: row.project
				});
			}
		}

		const states = kanbanSelectSchema.parse(Array.from(statesMap.values()));
		// Sort by order
		states.sort((a, b) => {
			if (a.order < b.order) {
				return -1;
			}
			if (a.order > b.order) {
				return 1;
			}
			return 0;
		});

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

		// Needed for part creation form
		const projects = projectsSelectSchema.parse(await db.select().from(project));
		const steps = stepSelectSchema.array().parse(await db.select().from(step));
		const templates = await getTemplatesWithSteps();

		// Forms
		const partCreationForm = await superValidate(zod4(newPartSchema));

		return {
			states,
			filteredProject,
			filteredAssignee,
			partCreationForm,
			projects,
			steps,
			templates
		};
	} catch (e) {
		console.error(getErrorMessage(e));
		error(500, 'Failed to query database');
	}
};

export const actions: Actions = {
	newPart: newPart,

	movePart: async (event) => {
		requireUser(event.locals, event.url.pathname);

		const rawData = await event.request.formData();
		// Object.fromEntries is needed because rawData is of type FormData. This approach won't work for complex data
		const data = movePartSchema.safeParse(Object.fromEntries(rawData.entries()));

		if (data.error) {
			return fail(400, data.error.message);
		}

		try {
			await db
				.update(part)
				.set({ stateId: data.data.newStateId })
				.where(eq(part.id, data.data.partId));
		} catch (e) {
			const msg = getErrorMessage(e);
			return fail(500, `Failed to query db: ${msg}`);
		}
	},

	archivePart: async (event) => {
		requireUser(event.locals, event.url.pathname);

		const rawData = await event.request.formData();
		// Object.fromEntries is needed because rawData is of type FormData. This approach won't work for complex data
		const data = archivePartSchema.safeParse(Object.fromEntries(rawData.entries()));

		if (data.error) {
			return fail(400, data.error.message);
		}

		try {
			await db.update(part).set({ archived: true }).where(eq(part.id, data.data.partId));
		} catch (e) {
			const msg = getErrorMessage(e);
			return fail(500, `Failed to query db: ${msg}`);
		}
	}
};
