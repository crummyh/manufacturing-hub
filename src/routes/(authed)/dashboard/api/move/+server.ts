import { db } from '$lib/server/db';
import { part } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import z from 'zod';

const MoveSchema = z.object({
	targetID: z.int(),
	partID: z.int(),
	order: z.string()
});

async function handleMove(request: Request, locals: App.Locals) {
	if (!locals.session || !locals.user) {
		error(401, 'Unauthorized');
	}

	const { targetID, partID, order } = MoveSchema.parse(await request.json());

	await db.update(part).set({ stateId: targetID, order }).where(eq(part.id, partID));

	return json('201');
}

export const PATCH: RequestHandler = ({ request, locals }) => handleMove(request, locals);
export const POST: RequestHandler = ({ request, locals }) => handleMove(request, locals);
