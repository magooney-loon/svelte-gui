import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { auth } from '$lib/utils';

export const load: PageLoad = async () => {
	if (!auth.isAuthenticated) {
		throw redirect(302, '/account/login');
	}

	return {
		user: auth.user,
		isAuthenticated: auth.isAuthenticated
	};
};
