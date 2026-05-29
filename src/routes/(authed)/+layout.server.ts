import { requireUser } from '$lib/server/auth.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	requireUser(locals, url.pathname);
};
