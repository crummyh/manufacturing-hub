<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import Plus from '@lucide/svelte/icons/plus';

	interface Props {
		selectionCount: number;
		useSelection(): void;
		createSelection(): void;
	}

	let { selectionCount, useSelection, createSelection }: Props = $props();
</script>

<header class="border-b bg-background">
	<div class="mx-auto flex h-14 items-center justify-between px-4">
		<div class="flex items-center gap-6">
			<a href={resolve('/')} class="text-sm font-semibold">MyApp</a>
		</div>

		<div class="flex items-center gap-3">
			{#if selectionCount !== 0}
				<Button variant="secondary" onclick={useSelection}
					><Plus />Use {selectionCount} Selections</Button
				>
			{:else}
				<Button onclick={createSelection}>Add Parts</Button>
			{/if}
		</div>
	</div>
</header>
