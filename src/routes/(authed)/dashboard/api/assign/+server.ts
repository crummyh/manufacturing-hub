import { db } from '$lib/server/db';
import { part } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import z from 'zod';

const AssignSchema = z.object({
	partID: z.int(),
	userID: z.string().optional()
});

export const PATCH: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.user) {
		error(401, 'Unauthorized');
	}

	// eslint-disable-next-line prefer-const
	let { userID, partID } = AssignSchema.parse(await request.json());

	if (!userID) {
		userID = locals.user.id;
	}

	await db.update(part).set({ assignedToId: userID }).where(eq(part.id, partID));

	return json('201');
};
