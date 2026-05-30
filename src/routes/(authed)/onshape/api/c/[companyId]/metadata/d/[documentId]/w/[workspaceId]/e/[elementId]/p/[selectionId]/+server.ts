import { auth, requireUser } from '$lib/server/auth';
import type { RequestHandler } from './$types';
import z from 'zod';

const endPointSchema = z.object({
	companyId: z.string(),
	documentId: z.string(),
	workspaceId: z.string(),
	elementId: z.string(),
	selectionId: z.string()
});

export const GET: RequestHandler = async ({ locals, params }) => {
	requireUser(locals);

	const { companyId, documentId, workspaceId, elementId, selectionId } =
		endPointSchema.parse(params);

	const { accessToken } = await auth.api.getAccessToken({
		body: {
			providerId: 'onshape',
			userId: locals.user.id
		}
	});

	const url = `https://${companyId}.onshape.com/api/metadata/d/${documentId}/w/${workspaceId}/e/${elementId}/p/${selectionId}`;
	const response = await fetch(url, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});

	const data = await response.json();
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
