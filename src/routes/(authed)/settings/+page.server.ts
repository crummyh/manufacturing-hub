import { resolve } from '$app/paths';
import { requireUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { finish, material, thickness } from '$lib/server/db/schema';
import { newFinishSchema, newMaterialSchema, newThicknessSchema } from '$lib/zod-schemas';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	const materials = await db.select().from(material);
	const finishes = await db.select().from(finish);
	const thicknesses = await db.select().from(thickness);

	// Forms
	const newMaterialForm = await superValidate(zod4(newMaterialSchema));
	const newFinishForm = await superValidate(zod4(newFinishSchema));
	const newThicknessForm = await superValidate(zod4(newThicknessSchema));

	return {
		user,
		materials,
		finishes,
		thicknesses,
		newMaterialForm,
		newFinishForm,
		newThicknessForm
	};
};

export const actions: Actions = {
	newMaterial: async (event) => {
		requireUser(event.locals, resolve('/settings'));

		const form = await superValidate(event, zod4(newMaterialSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			db.insert(material).values({ name: form.data.name });
		} catch {
			return fail(500, 'Failed to create material');
		}

		return { form };
	}
};
