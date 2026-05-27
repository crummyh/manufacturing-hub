<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client.js';
	import OnshapeNav from '$lib/components/onshape/onshape-nav.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		handleMessage,
		init,
		sendBlueBubble,
		selections,
		requestSelection,
		requestedSelections,
		SelectionType
	} from '$lib/onshape/right-panel.svelte';
	import type { User } from 'better-auth';
	import { onMount } from 'svelte';

	let user: User | null = $state(null);

	onMount(async () => {
		// Required because page is prerendered -> no server side
		const { data } = await authClient.getSession();
		if (data?.user) {
			user = data.user;
		} else if (window.top !== window.self) {
			goto(`/auth/signin?return=${encodeURIComponent('/onshape/part-studio-panel')}`);
		}

		init();
	});

	function useSelection() {}

	function createSelection() {
		requestSelection([SelectionType.Body]);
	}

	let selectionCount = $derived(
		$requestedSelections.length > 0 ? $requestedSelections.length : $selections.length
	);
</script>

<svelte:window
	onmessage={(e) => {
		if (user) handleMessage(e);
	}}
/>

<OnshapeNav {selectionCount} {createSelection} {useSelection} />

<Button variant="secondary" onclick={() => sendBlueBubble('Hello!')}>Send Message!</Button>
<div>{user?.name}</div>
