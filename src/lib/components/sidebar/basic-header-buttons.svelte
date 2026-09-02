<script lang="ts">
	import { Plus, RotateCw } from '@lucide/svelte';
	import { invalidateAll } from '$app/navigation';
	import PartCreationDialog from '$lib/components/cards/part-creation-dialog.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { NewPartSchemaClient } from '$lib/schemas/forms';
	import type { Projects } from '$lib/schemas/project';
	import type { Steps } from '$lib/schemas/step';
	import type { Templates } from '$lib/schemas/template';
	import type { InferIn, SuperValidated } from 'sveltekit-superforms';

	async function refreshDate() {
		refreshing = true;
		await invalidateAll();
		refreshing = false;
	}

	interface Props {
		data: Promise<{
			form: SuperValidated<InferIn<NewPartSchemaClient>>;
			projects: Projects;
			steps: Steps;
			templates: Templates;
		}>;
	}

	let { data }: Props = $props();

	let refreshing = $state(false);
	let creatingPart = $state(false);
</script>

<div class="flex items-center gap-1">
	<Dialog.Root bind:open={creatingPart}>
		<Dialog.Trigger class={buttonVariants()}>
			<Plus />New Part
		</Dialog.Trigger>
		<PartCreationDialog {data} bind:open={creatingPart} />
	</Dialog.Root>
	<Button variant="outline" onclick={refreshDate} disabled={refreshing}>
		<RotateCw class={[refreshing && 'animate-spin']} />
		Refresh
	</Button>
</div>
