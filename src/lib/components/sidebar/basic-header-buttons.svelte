<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import PartCreation from '$lib/components/cards/part-creation.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { NewPartSchemaClient } from '$lib/schemas/forms';
	import type { Projects } from '$lib/schemas/project';
	import type { Steps } from '$lib/schemas/step';
	import type { Templates } from '$lib/schemas/template';
	import { Plus, RotateCw } from '@lucide/svelte';
	import type { InferIn, SuperValidated } from 'sveltekit-superforms';

	async function refreshDate() {
		refreshing = true;
		await invalidateAll();
		refreshing = false;
	}

	interface Props {
		form: SuperValidated<InferIn<NewPartSchemaClient>>;
		projects: Projects;
		steps: Steps;
		templates: Templates;
	}

	let { projects, form, steps, templates }: Props = $props();

	let refreshing = $state(false);
	let creatingPart = $state(false);
</script>

<div class="flex items-center gap-1">
	<Dialog.Root bind:open={creatingPart}>
		<Dialog.Trigger class={buttonVariants()}>
			<Plus />New Part
		</Dialog.Trigger>
		<PartCreation {projects} {form} bind:open={creatingPart} {steps} {templates} />
	</Dialog.Root>
	<Button variant="outline" onclick={refreshDate} disabled={refreshing}>
		<RotateCw class={[refreshing && 'animate-spin']} />
		Refresh
	</Button>
</div>
