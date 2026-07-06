<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { RouteId } from '$app/types';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Folder, SquareKanban, Table, type LucideProps } from '@lucide/svelte';
	import type { Component } from 'svelte';

	// Todo: Highlight active page better

	const navItem: {
		name: string;
		url: RouteId;
		icon: Component<LucideProps>;
		order: number;
	}[] = [
		{
			name: 'Overview',
			url: '/(authed)/(app)/overview',
			icon: SquareKanban,
			order: 1
		},
		{
			name: 'Table',
			url: '/(authed)/(app)/table',
			icon: Table,
			order: 2
		},
		{
			name: 'Projects',
			url: '/(authed)/(app)/projects',
			icon: Folder,
			order: 3
		}
	];
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.Menu>
		{#each navItem as item (item.order)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton isActive={page.route.id === item.url}>
					{#snippet child({ props })}
						<a href={resolve(item.url)} {...props}>
							<item.icon />
							<span>{item.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
