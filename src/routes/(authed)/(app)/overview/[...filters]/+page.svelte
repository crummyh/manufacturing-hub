<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import PartCreation from '$lib/components/cards/part-creation.svelte';
	import KanbanState from '$lib/components/kanban-state.svelte';
	import PageHeader from '$lib/components/sidebar/page-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { PageProps } from './$types';
	import { Plus, RotateCw } from '@lucide/svelte';

	async function refreshDate() {
		refreshing = true;
		await invalidateAll();
		refreshing = false;
	}

	let { data }: PageProps = $props();

	let refreshing = $state(false);
	let creatingPart = $state(false);
</script>

<PageHeader>
	<div class="flex justify-between w-full items-center">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Page>Overview</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<div class="flex items-center gap-1">
			<Dialog.Root bind:open={creatingPart}>
				<Dialog.Trigger class={buttonVariants()}>
					<Plus />New Part
				</Dialog.Trigger>
				<PartCreation
					projects={data.projects}
					form={data.partCreationForm}
					bind:open={creatingPart}
					steps={data.steps}
					templates={data.templates}
				/>
			</Dialog.Root>
			<Button variant="outline" onclick={refreshDate} disabled={refreshing}>
				<RotateCw class={[refreshing && 'animate-spin']} />
				Refresh
			</Button>
		</div>
	</div>
</PageHeader>

<div class="m-2 flex gap-2 overflow-scroll px-0.5 py-2">
	{#each data.states as state, i (state.id)}
		<KanbanState
			{state}
			lastState={i !== 0 ? data.states[i - 1].id : undefined}
			nextState={i !== data.states.length - 1 ? data.states[i + 1].id : undefined}
		/>
	{/each}
</div>
