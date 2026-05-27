# Manufacturing Hub

An app to track part manufacturing and assembly at FRC Team 4786 Nicolet FEAR 

## Stack and Structure

The app is primarily a SvelteKit full stack web app with a PostgreSQL database for storage. It also integrates with Onshape.

## Local Development

### Setup

1. Clone this repo
2. Install npm
2. Install `mkcert` and run `mkcert localhost`
3. Install Docker Compose
4. Create a `.env` file based off of `.env.example`
5. Run `npm install`
6. Create a Onshape App in the Developer Portal with these important settings:

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

### Other commands
See `package.json` for all commands

- `npm run db:studio` - Run Drizzle Studio to interact with the database in the browser

## Todo and Status

This project is not even close to done. All todos and issues are in documented in the Github issues section.
