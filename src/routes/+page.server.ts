import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		redirect(302, '/auth/signin');
	} else {
		redirect(302, '/dashboard');
	}

	return {};
};
