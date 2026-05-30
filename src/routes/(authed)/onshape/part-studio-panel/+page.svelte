<script lang="ts">
	import { page } from '$app/state';
	import OnshapePartCreation from '$lib/components/forms/onshape-part-creation.svelte';
	import OnshapeNav from '$lib/components/onshape/onshape-nav.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { SelectionType } from '$lib/onshape/core.svelte';
	import { RightPanelClient, type Selection } from '$lib/onshape/right-panel.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	let onshapeClient: RightPanelClient = $state(null!);
	let isOpen = $state(false);
	let isLoadingData = $state(false);
	let partName: string | undefined = $state(undefined);

	onMount(() => {
		onshapeClient = new RightPanelClient(page.url.searchParams);
		onshapeClient.onRequestCompletion(async (s) => {
			await createPart(s);
		});
	});

	function createSelection() {
		onshapeClient.requestSelection([SelectionType.Body], 1);
	}

	function cancelSelection() {
		onshapeClient.stopRequest();
	}

	async function createPart(selections: Selection[]) {
		isOpen = true;
		isLoadingData = true;
		if (selections.length === 1) {
			const response = await fetch(
				`api/c/${onshapeClient.onshapeIds.companyId}/metadata/d/${onshapeClient.onshapeIds.documentId}/w/${onshapeClient.onshapeIds.workspaceId}/e/${onshapeClient.onshapeIds.elementId}/p/${selections[0].selectionId}`,
				{
					headers: { 'content-type': 'application/json' }
				}
			);
			const data = await response.json();
			console.log(data);
			partName = data.properties.find((i) => i.name === 'Name').value;
			isLoadingData = false;
		} else {
			console.error('Too many or too few selections');
		}
	}

	let isSelecting = $derived(onshapeClient ? onshapeClient.isSelecting : false);
</script>

<svelte:window
	onmessage={(e) => {
		onshapeClient.handleMessage(e);
	}}
/>

<OnshapeNav {createSelection} {cancelSelection} {isSelecting} />

<Dialog.Root bind:open={isOpen}>
	<OnshapePartCreation
		onshapePartForm={data.onshapePartForm}
		materials={data.materials}
		finishes={data.finishes}
		thicknesses={data.thicknesses}
		bind:isOpen
		{isLoadingData}
		defaultName={partName}
	/>
</Dialog.Root>

<Button variant="secondary" onclick={() => onshapeClient.sendBlueBubble('Hello!')}
	>Send Message!</Button
>
