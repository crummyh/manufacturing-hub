<script lang="ts">
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		class?: string;
	};

	let { class: className, ...restProps }: Props = $props();
</script>

<div
	data-slot="reorderable-handle-grip"
	class={cn(
		'text-muted-foreground hover:text-foreground data-[dragging=true]:text-foreground',
		'flex h-8 w-6 shrink-0 touch-none items-center justify-center rounded-md outline-none',
		'focus-visible:ring-ring/50 focus-visible:ring-3',
		'cursor-grab active:cursor-grabbing aria-disabled:pointer-events-none aria-disabled:opacity-50',
		className
	)}
	{...restProps}
>
	<GripVertical class="size-4" />
</div>
