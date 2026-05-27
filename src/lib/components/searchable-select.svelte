<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Fuse from 'fuse.js';

	interface Option {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		options: Option[];
		value?: string;
		onValueChange?: (value: string) => void;
		placeholder?: string;
		name?: string;
		disabled?: boolean;
		clearOption?: boolean;
		[key: string]: unknown;
	}

	let {
		options,
		value = $bindable(''),
		onValueChange,
		placeholder = 'Select an option…',
		name,
		disabled = false,
		clearOption = false,
		...attrs
	}: Props = $props();

	const fuse = $derived(new Fuse(options, { keys: ['label'], threshold: 0.4 }));

	let searchQuery = $state('');
	let open = $state(false);

	const filteredOptions = $derived(
		searchQuery.trim() === '' ? options : fuse.search(searchQuery).map((r) => r.item)
	);

	const triggerLabel = $derived(options.find((o) => o.value === value)?.label ?? placeholder);

	// Clear search when closed
	$effect(() => {
		if (!open) searchQuery = '';
	});

	function handleValueChange(newValue: string) {
		value = newValue;
		onValueChange?.(newValue);
	}
</script>

<Select.Root type="single" {name} {disabled} {value} onValueChange={handleValueChange} bind:open>
	<Select.Trigger {...attrs}>
		{triggerLabel}
	</Select.Trigger>
	<Select.Content class="max-h-80">
		<div class="px-2 pt-1 pb-2">
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
			{#if clearOption && value !== ''}
				<Select.Item value="" label="Clear">Clear</Select.Item>
			{/if}
			{#each filteredOptions as option (option.value)}
				<Select.Item value={option.value} label={option.label} disabled={option.disabled}>
					{option.label}
				</Select.Item>
			{/each}
		{/if}
	</Select.Content>
</Select.Root>
