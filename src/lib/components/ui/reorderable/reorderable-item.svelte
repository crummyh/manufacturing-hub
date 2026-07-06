<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';

	type Props = {
		el?: HTMLLIElement | null;
		dragging?: boolean;
		class?: string;
		children: Snippet;
	};

	let { el = $bindable(), dragging = false, class: className, children }: Props = $props();
</script>

<li
	bind:this={el}
	data-slot="reorderable-item"
	data-dragging={dragging}
	class={cn(
		'bg-background border-input relative flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-shadow',
		'data-[dragging=true]:border-ring data-[dragging=true]:ring-ring/50 data-[dragging=true]:ring-3 data-[dragging=true]:z-10 data-[dragging=true]:shadow-lg',
		className
	)}
>
	{@render children()}
</li>
