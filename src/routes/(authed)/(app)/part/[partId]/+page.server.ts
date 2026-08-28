import { error } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { part } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import type { PageServerLoad } from './$types';
import z from 'zod';

export const load: PageServerLoad = async ({ params, locals, url }) => {
	requireUser(locals, url.hostname);

	const { data: partId, error: parseError } = z.nanoid().safeParse(params.partId);
	if (parseError) {
		return error(400, parseError.message);
	}

	let partData;
	try {
		partData = await db.select().from(part).where(eq(part.id, partId)).limit(1);
	} catch {
		error(500, 'Failed to query database');
	}

	if (partData.length !== 1) {
		error(404, 'Part not found');
	}

	return { part: partData[0] };
};
