# Manufacturing Hub

An app to track part manufacturing and assembly at FRC Team 4786 Nicolet FEAR

## Stack and Structure

- SvelteKit
- Drizzle ORM
- PostgreSQL
- TailwindCSS
- shadcn-svelte
- Zod
- Superforms

Some important paths:
- `src/lib/components/` - Reusable components for use across the app
- `src/lib/onshape/` - Helpers for integrating with the Onshape API and panel
- `src/lib/server/db/` - Database setup, helpers, and schemas
- `src/routes/(authed)` - Routes that require the user to be authenticated
- `src/routes/auth` - Routes that relate to the auth flow

## Local Development

### Setup

1. Clone this repo
2. Install npm
3. Install `mkcert` and run `mkcert localhost`
4. Install Docker Compose
5. Create a `.env` file based off of `.env.example`
6. Run `npm install`
7. Create a Onshape App in the Developer Portal with these important settings:

```
Name: `FEAR BAGs (DEV)`
Primary format: `com.nicoletfear.bag.dev`
Summary: The dev version of Nicolet FEAR's Manufacturing Hub software.
Redirect URLs: `https://localhost:5173/api/auth/oauth2/callback/onshape`
```

7. Create an extension in this App with the following settings:

```
Name: FEAR BAG
Location: Element right panel
Context: Inside part studio
Action URL: `https://localhost:5173/onshape/part-studio-panel?documentId={$documentId}&workspaceId={$workspaceOrVersionId}&elementId={$elementId}`
```

### Running the dev server

1. Run `npm run db:start` to start the database
2. In another terminal run `npm run db:push` to push the schema to the database
3. Then run `npm run dev` to start the development server

### Before committing

Before committing code, you should do a few checks:

1. `npm run lint` to check prettier and eslint
2. `npm run format` to format your code
3. `npm run test` to test your code against its tests

### Other commands

See `package.json` for all commands

- `npm run db:studio` - Run Drizzle Studio to interact with the database in the browser

## Todo and Status

This project is not even close to done. All todos and issues are in documented in the Github issues section.
