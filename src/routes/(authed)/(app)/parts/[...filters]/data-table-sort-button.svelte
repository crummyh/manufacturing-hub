<script lang="ts">
	import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ComponentProps } from 'svelte';
	import type { SortDirection } from '@tanstack/svelte-table';
	import { ArrowDown, ArrowUp, type LucideIcon } from '@lucide/svelte';

	interface Props extends ComponentProps<typeof Button> {
	    label: string;
		sortDir: false | SortDirection;
		AscIcon?: LucideIcon
		DescIcon?: LucideIcon
	}

	let { label, onclick, sortDir, AscIcon = ArrowUp, DescIcon = ArrowDown, variant = 'ghost', ...restProps }: Props = $props();

	// let currentSort = $derived(browser ? getSortDir() : false);
</script>

<div class="items-center flex gap-0.5">
    {label}
    <Button {variant} {onclick} {...restProps} aria-label="Filter by column">
        {#if sortDir === "desc"}
            <AscIcon class="size-4" />
        {:else if sortDir === "asc"}
            <DescIcon class="size-4" />
        {:else}
            <ArrowUpDownIcon class="size-4" />
        {/if}
    </Button>
</div>
