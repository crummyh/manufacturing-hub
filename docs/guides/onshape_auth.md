Thanks to the excellent advise of @VenomousFire and @gdgr, I have a solution! It is very specific to my problems, and 100% will need modification. I recommend having someone (or AI if you have to) check your code before putting this in production.

The key issue is that the Onshape iframe blocks the cookies that Better Auth needs to authenticate. Without this, your server will never see you as signed in, and **shouldn't** let you do anything important (If you are letting un-authenticated users mutate data, you are doing something wrong). So the fix, as @VenomousFire recommended is to use `secure=true` and `SameSite=None` cookies. This requires a whole setup, but is not that bad.

[size=70]Some browsers have issues with `SameSite=None` cookies, specifically Firefox with strict tracking protection, Brave, and Safari ITP. Just keep this in mind.[/size]

## 1. Set up HTTPS

Secure cookies require https, so you need to use https for your dev environment.

1. Install [mkcert](https://github.com/FiloSottile/mkcert). On Ubuntu this means running `sudo apt install libnss3-tools`, `sudo apt install mkcert`, then `mkcert -install` (restart your browser)
2. Add a localhost certificate by running `mkcert localhost`
3. Load this certificate to your server config:

```ts
// vite.config.ts
import fs from 'fs';

export default defineConfig({
	// ... your existing config
	server: {
		https: {
			key: fs.readFileSync('./localhost-key.pem'),
			cert: fs.readFileSync('./localhost.pem')
		}
	}
});
```

## 2. Change Cookie Config

```ts
// src/lib/server/auth.ts or wherever your config is
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
	// ... your existing config

	advanced: {
		// optional but recommended (avoids collisions if multiple Better Auth apps share a domain)
		cookiePrefix: 'my-app',
		defaultCookieAttributes: {
			secure: true,
			sameSite: 'none',
			httpOnly: true,
			path: '/'
		}
	}
});
```

## 3. Harden CORS and CSRF

Because the cookies are set to `sameSite=None`, this allows cross-site credentialed requests, so we have to lock down which origins are allowed. It also allows CSRF attacks, so we have to deal with those as well:

```ts
// hooks.server.ts - Specific to SvelteKit, you will need to modify
import { building } from '$app/environment';
import { PUBLIC_ONSHAPE_ENTERPRISE, ORIGIN } from '$env/static/public';
import { auth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';

if (!ORIGIN || !ONSHAPE_ENTERPRISE)
	throw new Error('Missing required env vars (ORIGIN or ONSHAPE_ENTERPRISE)');

const ALLOWED_ORIGINS = [ORIGIN, `https://${ONSHAPE_ENTERPRISE}.onshape.com`];
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const handleCors: Handle = async ({ event, resolve }) => {
	const origin = event.request.headers.get('origin');
	const isAllowed = origin && ALLOWED_ORIGINS.includes(origin);

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
```

## Done!

Now, you can get the current user and login in the Onshape window just like normally!

Just keep in mind that you shouldn't be doing any heavy work on the frontend, especially in the Onshape iframe. Just:
[quote="VenomousFire, post:4, topic:520931"]
do your Onshape calls from your backend webserver
[/quote]

[details="The warning"]
Of course, I have to add the warning: I am not an expert, nor do I truly know what I am doing. If you really need to keep data secure, don't follow what I am doing. This is just my best effort attempt, with some basic AI review. If you are going to use this for something real and production (outside of your team, for example), get someone who actually knows what they are doing to check it.
[/details]

## Edit:

I forgot to say this, but you have to update your Onshape App's URLs to match the new HTTPS configuration. Just change every reference of `http://` to `https://`
