import { resolve } from '$app/paths';
import { requireUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { material } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import z from 'zod';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	const materials = await db.select().from(material);
	return { user, materials };
};

const newMaterialSchema = z.object({
	name: z.string().min(1),
	onshapeName: z.string().optional()
});

export type NewMaterialSchema = typeof newMaterialSchema;

export const actions: Actions = {
	createMaterial: async (event) => {
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
