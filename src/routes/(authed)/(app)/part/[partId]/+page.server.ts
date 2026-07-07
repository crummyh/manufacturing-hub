import { requireUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { part } from '$lib/server/db/schema';
import { fromSqid } from '$lib/sqid';
import { getErrorMessage } from '$lib/utils';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals, url }) => {
	requireUser(locals, url.hostname);

	let partId;
	try {
		partId = fromSqid(params.partId);
	} catch (e) {
		error(400, getErrorMessage(e));
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
