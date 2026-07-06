<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Popover from '$lib/components/ui/popover';
	import Fuse from 'fuse.js';
	import type { Snippet } from 'svelte';

	interface Option {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		trigger: Snippet;
		options: Option[];
		onValueChange?: (value: string) => void;
		disabled?: boolean;
	}

	let { trigger, options, onValueChange }: Props = $props();

	const fuse = $derived(new Fuse(options, { keys: ['label'], threshold: 0.4 }));

	let searchQuery = $state('');
	let open = $state(false);

	const filteredOptions = $derived(
		searchQuery.trim() === '' ? options : fuse.search(searchQuery).map((r) => r.item)
	);

	// Clear search when closed
	$effect(() => {
		if (!open) searchQuery = '';
	});
</script>

<Popover.Root bind:open>
	{@render trigger()}
	<Popover.Content class="max-h-80">
		<div>
			<Input
				type="text"
				placeholder="Search…"
				bind:value={searchQuery}
				onkeydown={(e) => e.stopPropagation()}
			/>
		</div>

		{#if filteredOptions.length === 0}
			<p class="px-2 py-4 text-center text-sm text-muted-foreground">No results found.</p>
		{:else}
			{#each filteredOptions as option (option.value)}
				<button
					onclick={() => {
						if (onValueChange) onValueChange(option.value);
						open = false;
					}}
					class="flex w-full hover:bg-secondary py-1 px-2 rounded-md"
				>
					{option.label}
				</button>
			{/each}
		{/if}
	</Popover.Content>
</Popover.Root>
