import { requireUser } from '$lib/server/auth.js';
import { getFinishes, getMaterials, getThicknesses } from '$lib/server/db/helpers/kanban';
import { db } from '$lib/server/db/index.js';
import { part, state } from '$lib/server/db/schema.js';
import { onshapePartSchema } from '$lib/zod-schemas.js';
import type { Actions, PageServerLoad } from './$types.js';
import { fail } from '@sveltejs/kit';
import { asc } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	const [thicknesses, materials, finishes] = await Promise.all([
		getThicknesses(),
		getMaterials(),
		getFinishes()
	]);

	return {
		onshapePartForm: await superValidate(zod4(onshapePartSchema)),
		thicknesses,
		materials,
		finishes
	};
};

export const actions: Actions = {
	onshapePart: async (event) => {
		requireUser(event.locals);

		const form = await superValidate(event, zod4(onshapePartSchema));
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
			critical: form.data.critical,
			order: '0',
			stateId: firstStateId
		});

		return {
			form
		};
	}
};
