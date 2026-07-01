import { auth } from '$lib/server/auth';
import { toSvelteKitHandler } from 'better-auth/svelte-kit';

// @ts-expect-error: GET and POST don't exist
export const { GET, POST } = toSvelteKitHandler(auth);
