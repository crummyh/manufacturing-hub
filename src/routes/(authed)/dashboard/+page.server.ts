import { requireUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import {
	getFinishes,
	getKanbanColumns,
	getMaterials,
	getProjects,
	getThicknesses
} from '$lib/server/db/helpers/kanban';
import { part, state } from '$lib/server/db/schema';
import { manualPartSchema } from '$lib/zod-schemas';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { asc } from 'drizzle-orm';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async () => {
	const [cols, thicknesses, materials, finishes, projects] = await Promise.all([
		getKanbanColumns(),
		getThicknesses(),
		getMaterials(),
		getFinishes(),
		getProjects()
	]);

	return {
		cols,
		thicknesses,
		materials,
		finishes,
		projects,
		manualPartForm: await superValidate(zod4(manualPartSchema))
	};
};

export const actions: Actions = {
	manualPart: async (event) => {
		requireUser(event.locals);

		const form = await superValidate(event, zod4(manualPartSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const firstStateId = (await db.select().from(state).orderBy(asc(state.order)))[0].id;

		await db.insert(part).values({
			name: form.data.name,
			quantity: form.data.quantity,
			thicknessId: form.data.thickness,
			materialId: form.data.material,
			finishId: form.data.finish,
			order: 0,
			stateId: firstStateId
		});

		return {
			form
		};
	}
};
