<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import type { Finishes, Materials, Thicknesses } from '$lib/server/db/helpers/kanban';
	import type { ManualPartSchema } from '$lib/zod-schemas';
	import ManualPartCreation from './forms/manual-part-creation.svelte';
	import Button, { buttonVariants } from './ui/button/button.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import RefreshCcw from '@lucide/svelte/icons/refresh-ccw';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { Infer } from 'zod';

	let refreshing = $state(false);
	let isOpen = $state(false);

	async function refreshCards() {
		refreshing = true;
		await invalidateAll();
		refreshing = false;
	}

	interface Props {
		manualPartForm: SuperValidated<Infer<ManualPartSchema>>;
		thicknesses: Thicknesses;
		materials: Materials;
		finishes: Finishes;
	}

	let { manualPartForm, thicknesses, materials, finishes }: Props = $props();
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger type="button" class={buttonVariants({ variant: 'secondary' })}
		><Plus />New Task</Dialog.Trigger
	>
	<ManualPartCreation {manualPartForm} {thicknesses} {materials} {finishes} bind:isOpen />
</Dialog.Root>

<Button variant="outline" onclick={refreshCards} disabled={refreshing}>
	<RefreshCcw class={refreshing ? 'animate-spin' : ''} />
	Refresh
</Button>
