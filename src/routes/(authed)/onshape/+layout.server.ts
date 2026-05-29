import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const onshapeCompanyId = url.searchParams.get('companyId'); // Get the Onshape subdomain
	return { onshapeCompanyId };
};
