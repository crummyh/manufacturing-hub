import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { OAuth2UserInfo, User } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { genericOAuth } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: false },
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: 'onshape',
					clientId: env.ONSHAPE_CLIENT_ID,
					clientSecret: env.ONSHAPE_CLIENT_SECRET,
					authorizationUrl: `https://${env.ONSHAPE_ENTERPRISE == 'cad' ? 'oauth' : env.ONSHAPE_ENTERPRISE}.onshape.com/oauth/authorize`,
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

export function requireUser(locals: App.Locals): User {
	if (!locals.user) redirect(303, '/auth/signin');
	return locals.user;
}
