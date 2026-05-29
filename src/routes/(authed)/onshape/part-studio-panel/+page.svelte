<script lang="ts">
	import { page } from '$app/state';
	import OnshapeNav from '$lib/components/onshape/onshape-nav.svelte';
	import { Button } from '$lib/components/ui/button';
	import { SelectionType } from '$lib/onshape/core';
	import { RightPanelClient } from '$lib/onshape/right-panel.svelte';
	import { onMount } from 'svelte';

	let onshapeClient: RightPanelClient = $state(null!);
	onMount(() => {
		onshapeClient = new RightPanelClient(page.url.searchParams);
	});

	function useSelection() {}

	function createSelection() {
		onshapeClient.requestSelection([SelectionType.Body]);
	}

	let selectionCount = $derived(
		onshapeClient
			? onshapeClient.requestedSelections.length > 0
				? onshapeClient.requestedSelections.length
				: onshapeClient.selections.length
			: 0
	);
</script>

<svelte:window
	onmessage={(e) => {
		onshapeClient.handleMessage(e);
	}}
/>

<OnshapeNav {selectionCount} {createSelection} {useSelection} />

<Button variant="secondary" onclick={() => onshapeClient.sendBlueBubble('Hello!')}
	>Send Message!</Button
>
