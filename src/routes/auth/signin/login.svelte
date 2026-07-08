<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';

	let { redirectUrl }: { redirectUrl: string } = $props();

	let loading = $state(false);
	let error = $state(false);

	$effect(() => {
		if (page.url.searchParams.get('error')) {
			error = true;
			console.error('Auth error in params');
		}
	});

	async function logIn() {
		loading = true;

		const { error: err } = await authClient.signIn.oauth2({
			providerId: 'onshape',
			callbackURL: redirectUrl
		});

		if (err) {
			error = true;
			console.error('Auth error:', err);
			loading = false;
		}
	}
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if !error}
			<Button type="submit" class="w-full" onclick={logIn}>
				{#if loading}
					<Spinner /> Logging in...
				{:else}
					Login with Onshape
				{/if}
			</Button>
		{:else}
			An error occurred, try again later
		{/if}
	</Card.Content>
	<Card.Footer>
		<div class="text-sm">If you don't have an account, talk to your group lead</div>
	</Card.Footer>
</Card.Root>
