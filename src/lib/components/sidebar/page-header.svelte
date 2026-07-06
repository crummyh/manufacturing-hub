<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
	}

	let { children, ...restProps }: Props = $props();
</script>

<header class="flex h-16 shrink-0 items-center gap-2">
	<div class="flex flex-1 items-center gap-2 px-4" {...restProps}>
		<Sidebar.Trigger class="-ms-1" />
		<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
		{@render children()}
	</div>
</header>
