import { resolve } from '$app/paths';
import { getRequestEvent } from '$app/server';
import {
	BETTER_AUTH_SECRET,
	ONSHAPE_CLIENT_ID,
	ONSHAPE_CLIENT_SECRET,
	ORIGIN
} from '$env/static/private';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { OAuth2UserInfo, User } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { genericOAuth } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';

export const auth = betterAuth({
	baseURL: ORIGIN,
	secret: BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: false },
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: 'onshape',
					clientId: ONSHAPE_CLIENT_ID,
					clientSecret: ONSHAPE_CLIENT_SECRET,
					authorizationUrl: `https://oauth.onshape.com/oauth/authorize`,
					tokenUrl: 'https://oauth.onshape.com/oauth/token',
					scopes: ['OAuth2ReadPII', 'OAuth2Read'],
					getUserInfo: async (tokens) => {
						const res = await fetch('https://cad.onshape.com/api/users/sessioninfo', {
							headers: {
								Authorization: `Bearer ${tokens.accessToken}`
							}
						});

						if (!res.ok) return null;

						const profile = await res.json();

						return {
							id: profile.id,
							name: `${profile.firstName} ${profile.lastName}`.trim(),
							email: profile.email,
							image: profile.image ?? null,
							emailVerified: true // Onshape accounts are verified
						} as OAuth2UserInfo;
					}
				}
			]
		}),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	],
	advanced: {
		// cookiePrefix: 'my-app', // optional
		defaultCookieAttributes: {
			secure: true,
			sameSite: 'none',
			httpOnly: true,
			path: '/'
		}
	}
});

/*
 * Require the user to be signed in. Redirects to `returnTo` after.
 * Example usage:
 * ```ts
 * export const load = async ({ locals, url }) => {
 *	requireUser(locals, url.pathname);
 * };
 * ```
 */
export function requireUser(locals: App.Locals, returnTo?: string): User {
	if (!locals.user) {
		// If no user
		let url = resolve('/auth/signin');

		// Add the returnTo route to redirect the user to after auth
		if (returnTo) {
			url += '?' + new URLSearchParams({ return: encodeURIComponent(returnTo) }).toString();
		}

		redirect(303, url);
	}

	return locals.user;
}
