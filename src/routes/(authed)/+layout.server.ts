import { requireUser } from '$lib/server/auth.js';

export const load = async ({ locals }) => {
	requireUser(locals);
};
