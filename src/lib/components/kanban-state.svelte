<script lang="ts">
	import { resolve } from '$app/paths';
	import type { KanbanState } from '../../routes/(authed)/(app)/overview/[...filters]/schemas';
	import KanbanPart from './cards/kanban-part.svelte';
	import Badge from './ui/badge/badge.svelte';
	import { buttonVariants } from './ui/button/button.svelte';
	import { Ellipsis } from '@lucide/svelte';

	interface Props {
		state: KanbanState;
		nextState?: string;
		lastState?: string;
	}

	let { state, nextState, lastState }: Props = $props();

	function removePart(id: string) {
		state.parts = state.parts.filter((p) => p.id !== id);
	}
</script>

<div class="flex flex-col gap-2">
	<div
		class="bg-secondary border-border border text-secondary-foreground p-2 rounded-md flex items-center gap-2 justify-between"
	>
		<div>
			<Badge class="tabular-nums">{state.parts.length}</Badge>
			{state.name}
		</div>
		<a
			class={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
			href={resolve('/(authed)/(app)/table')}><Ellipsis /></a
		>
	</div>
	{#if state.parts.length > 0}
		{#each state.parts as part (part.name)}
			<KanbanPart {part} {lastState} {nextState} {removePart} />
		{/each}
	{:else}
		<div
			class="w-xs h-20 border-border border border-dashed p-2 rounded-md flex items-center justify-center"
		>
			<span>No parts</span>
		</div>
	{/if}
</div>
