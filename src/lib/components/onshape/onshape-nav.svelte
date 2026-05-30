<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Ban from '@lucide/svelte/icons/ban';

	interface Props {
		// selectionCount: number;
		isSelecting: boolean;
		createSelection(): void;
		cancelSelection(): void;
	}

	let { createSelection, cancelSelection, isSelecting }: Props = $props();
</script>

<header class="border-b bg-background">
	<div class="mx-auto flex h-14 items-center justify-between px-4">
		<div class="flex items-center gap-6">
			<a href={resolve('/')} class="text-sm font-semibold">MyApp</a>
		</div>

		<div class="flex items-center gap-3">
			{#if isSelecting}
				<!-- <Dialog.Root>
					<Dialog.Trigger type="button" class={buttonVariants({ variant: 'secondary' })}
						><Plus />Use {selectionCount} Selections</Dialog.Trigger
					>
				</Dialog.Root> -->

				<Button variant="ghost" onclick={cancelSelection}><Ban />Cancel</Button>
			{:else}
				<Button onclick={createSelection}>Add Parts</Button>
			{/if}
		</div>
	</div>
</header>
