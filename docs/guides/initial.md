**_I am by no means an expert in this subject, or in web development in general. Take everything I say with a grain of salt._**

I recently started work on an Onshape app, and getting everything set up me a bit to figure out. So as the off season starts, I figure people might appreciate a guild to help them on their projects. Note that I am not done with my work yet, so I might be missing some things that are actually important. **Feel free to respond with any questions, changes, or issues.** This guild assumes that you have at least basic knowledge of JS/TS and any framework (Full stack or backend).

# 1: Auth Setup

[Onshape Auth Docs](https://onshape-public.github.io/docs/auth/)
Onshape has two main methods for authenticating: API keys and OAuth. API keys are great for very small projects, but they struggle with larger apps because of their [tight usage limits](https://onshape-public.github.io/docs/auth/limits/). So I recommend using OAuth for pretty much everything.

The general flow of OAuth is not increadably complex, but I personaly did not want to go about implmenting it myself ([the docs](https://onshape-public.github.io/docs/auth/oauth/) are a realy great place to start if you feel you need to, and they provide full Python Flask and Node Express code at the bottom if you want), and I don’t trust myself with core auth logic anyway, so I used [Better Auth](https://better-auth.com/) as a base. It is specific to JS, I belive similar libraries or guilds exist for other languages.

1. [Set up Better Auth](https://better-auth.com/docs/installation), read the docs for integrating with your specific framework. There are almost always extra steps.
2. Configure Better Auth Generic OAuth to allow authentication with Onshape (The code below was designed for Drizzle and SvelteKit, and I have not tested it elsewhere. It might need some modifications) [Docs](https://better-auth.com/docs/plugins/generic-oauth)

```js
// snip
export const auth = betterAuth({
  // snip
  	plugins: [
		genericOAuth({
			config: [
				{
                    // Everywhere I reference `env`, I am pulling data from the .env file
                    // Refer to your framework's docs for how to do this.
					providerId: 'onshape',
					clientId: env.ONSHAPE_CLIENT_ID,
					clientSecret: env.ONSHAPE_CLIENT_SECRET,
					authorizationUrl: `https://${env.ONSHAPE_ENTERPRISE == 'cad' ? 'oauth' : env.ONSHAPE_ENTERPRISE}.onshape.com/oauth/authorize`, // I don't know if this is strictly needed
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
		// snip
```

3. [Update your auth client to add the `genericOAuthClient`](https://better-auth.com/docs/plugins/generic-oauth#add-the-client-plugin)
4. Push your changes with `npx auth generate` and `npx auth migrate`
   [details="Full Code"]
   This example is for SvelteKit and Drizzle, but can be modified to fit anything Better Auth supports.

```js
import { betterAuth } from 'better-auth/minimal';
import { genericOAuth } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import type { OAuth2UserInfo } from 'better-auth';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: false }, // I have this disabled, you can enable it if you want
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
	]
});
```

[/details]

# 2. Onshape App Setup

3. Create an Onshape Application:
   a. Go to the [dev portal](https://cad.onshape.com/appstore/dev-portal/)
   b. Click the Create new OAuth application button.
   ![Create an application in the dev portal](https://onshape-public.github.io/images/create-app-01.png)
   c. Fill out the form with these values:
   **Name**: Whatever you want to name your app. I recommend putting “dev” at the end to remind you that this app is the development version
   **Primary Format**: A [Java style reverse domain name](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) for your app. If you have a team site you can use that, plus a name for your project
   **Summary**: Some summary of your app
   **_Redirect URL_**: This is important! it needs to point to `${YOUR_BASE_URL}/api/auth/oauth2/callback/onshape`, where `YOUR_BASE_URL` is the base of the URL you are using. For development, this is normally some variation on `http://localhost:XXXX/`. Just run you app (with `npm run dev` or similar), and use the URL it provides.
   **Type**: Integrated Cloud App. If you just want to authenticate you can use Cloud Connected, and if you are making a desktop app use Desktop, but 95% of projects should just use Integrated
   **OAuth URL**: Some place to start login if you are starting from the app store. I would just leave it blank for now. Later you can change it to your login page.
   **Permissions**: Select the permissions you need to make your app work. Definitely use `Application can read your profile information`, others are up to what you want. This can be changed later.
   d. Click "create," and **copy the secret key!** This needs to go somewhere safe, preferably in a `.env` file. This file needs to look something like this:

```sh
ONSHAPE_CILENT_ID="YOUR_ID_HERE"
ONSHAPE_CLIENT_SECRET="YOUR_SECRET_HERE"
ONSHAPE_ENTERPRISE="cad"
```

4. Register your app with store, but don't publish it
   a. Navigate to the menu for your app, and hit "Create store entry"
   <img src="https://onshape-public.github.io/images/create-store-entry-03.png" alt="Create store entry button in the dev portal"/>
   b. Don't worry, this does not make it public, it just lets you install it. Fill out the form, and hit Create.
   c. Head to the [App Store](https://cad.onshape.com/appstore?sort=date) and subscribe to the app.

# 3. Login

Now that you have Auth setup, you can log in. You can do this anywhere in your UI by just running:

```ts
await authClient.signIn.oauth2({
	providerId: 'onshape',
	callbackURL: '/dashboard', // Page to go to after author is done
	errorCallbackURL: '/error' // Page to go to with errors
});
```

From here you have a Better Auth [session](https://better-auth.com/docs/concepts/session-management), and can do really anything.

# 4. API Calls

Now this is the part that I am not 100% sure works, as I have not done extensive checking on it. It should work for basic things though. You can just use Better Auth's [`getAccessToken`](https://better-auth.com/docs/concepts/oauth#get-access-token) method to authenticate requests to Onshape's API:

```ts
// This is server side! You need to use the auth client for client side

const { data } = await auth.api.getAccessToken({
	body: {
		providerId: 'onshape',
		userId: session.user.id // See https://better-auth.com/docs/concepts/session-management#get-session
	}
});

const response = await fetch('https://cad.onshape.com/api/documents', {
	headers: {
		Authorization: `Bearer ${data.accessToken}`
	}
});
```

The [API Explorer](https://cad.onshape.com/glassworks/explorer/) is a great way to see what is avalable.

# 5. Integrating with Onshape

Now you don't want to just call Onshape, you want to become one with it. Merging your app with the system just like you merge with your CAD, untill it becomes impossible to tell where one starts and the other ends...

Maybe that's a bit far, but you want to put your app in Onshape. This is done with Extensions. There are a _ton_ available, I highly recomend reading the [docs](https://onshape-public.github.io/docs/app-dev/extensions/) on this one.

Once you have desided what you want, you can create it like this:

1. Open your app, go to Extentions, and click "Add Extention"
2. Fill out the form:
   a. Name: Whatever identifies your app and extension
   b. Location: Whatever location you decided you wanted from the docs. "Right panel" is probably the most common.
   c. Context: Where you want the extension to apply.
   d. **Action URL**: This is the important one. This is the page you want Onshape to open. I used `http://localhost:5173/onshape/part-studio-panel?documentId={$documentId}&workspaceId={$workspaceOrVersionId}&elementId={$elementId}`, and created a page there to go with it. Those `${}` placeholders are for parameters, which Onshape fills in for us. [The list is on this page](https://onshape-public.github.io/docs/app-dev/extensions/)
   e. Icon: Add an SVG if you want
3. Create the actual page to go to. This varies a lot between different frameworks, so I won't show it, but you just have to create some page to open, that takes the Action URL parameters.
4. Integrate with Onshape.
   b. The main way of interacting with the main Onshape window is with [client messaging](https://onshape-public.github.io/docs/app-dev/clientmessaging/).
   c. The docs for right panel messages are [here](https://onshape-public.github.io/docs/app-dev/element-right-panel/),
   d. and the docs for element tabs are [here](https://onshape-public.github.io/docs/app-dev/element-tab/).

And that's really it. You should be free to create whatever you want now, or at least get as far as I do before having problems. If you have any issues, questions or changes just reply, I should get back pretty quickly as I am 100% addicted to CD. If you make anything cool, feel free to share! Thanks for reading, and good luck!
