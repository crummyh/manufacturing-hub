import { building } from '$app/environment';
import { ORIGIN } from '$env/static/private';
import { auth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';

if (!ORIGIN) throw new Error('Missing required env vars (ORIGIN)');

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const handleCors: Handle = async ({ event, resolve }) => {
	const origin = event.request.headers.get('origin');
	const isAllowed =
		origin &&
		(ORIGIN === origin || origin.match('^https:[a-zA-Z0-9_-]*.onshape.com')?.length === 1);

	// Reject cross-origin mutations from unknown origins.
	if (MUTATING_METHODS.has(event.request.method) && origin && !isAllowed) {
		return new Response('Forbidden', { status: 403 });
	}

	// Short-circuit preflight requests
	if (event.request.method === 'OPTIONS') {
		if (!isAllowed) {
			return new Response('Forbidden', { status: 403 });
		}

		return new Response(null, {
			status: 204,
			headers: isAllowed
				? {
						'Access-Control-Allow-Origin': origin,
						'Access-Control-Allow-Credentials': 'true',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type, Authorization',
						Vary: 'Origin'
					}
				: {}
		});
	}

	const response = await resolve(event);

	if (isAllowed) {
		response.headers.set('Access-Control-Allow-Origin', origin);
		response.headers.set('Access-Control-Allow-Credentials', 'true');
		response.headers.set('Vary', 'Origin');
	}

	return response;
};

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleCors, handleBetterAuth);
