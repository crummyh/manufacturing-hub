<script lang="ts">
	import type { KanbanColumn } from '$lib/server/db/helpers/kanban';
	import { Badge } from '../ui/badge';
	import type { Snippet } from 'svelte';

	interface Props {
		col: KanbanColumn;
		children: Snippet<[]>;
		[key: string]: unknown;
	}

	let { col, children, ...props }: Props = $props();
</script>

<div
	class="drop-zone flex w-72 shrink-0 flex-col transition-transform duration-150 ease-in-out"
	{...props}
>
	<div
		class="mb-2 flex items-center justify-between rounded-lg border border-border bg-muted px-3 py-2"
	>
		<span class="text-sm font-bold tracking-wide uppercase">{col.name}</span>
		<Badge variant="secondary">
			{col.parts.length}
		</Badge>
	</div>

	<div
		class="card-list min-h-16 flex-1 rounded-lg border-2 border-dashed border-transparent p-1 transition-all duration-150"
	>
		{@render children()}

		<div
			class="drop-indicator pointer-events-none mt-1 rounded-md border-2 border-dashed border-border py-4 text-center text-xs text-muted-foreground/50 opacity-0 transition-opacity duration-200"
		>
			Drop here
		</div>
	</div>
</div>

<style>
	:global(.drop-zone.dnd-over) .card-list {
		background: hsl(var(--primary) / 0.06);
		border-color: var(--border);
		box-shadow: inset 0 0 0 1px hsl(var(--primary) / 0.15);
	}

	:global(.drop-zone.dnd-over) .drop-indicator {
		opacity: 1;
		color: hsl(var(--primary) / 0.6);
		border-color: hsl(var(--primary) / 0.35);
	}
</style>
