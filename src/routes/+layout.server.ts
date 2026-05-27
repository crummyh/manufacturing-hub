import { auth } from '$lib/server/auth';

export const load = async (event) => {
	return {
		user: event.locals.user ?? null,
		session: event.locals.session ?? null
	};
};
