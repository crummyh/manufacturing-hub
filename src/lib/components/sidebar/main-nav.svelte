<script lang="ts">
	import { Bolt, Cog, Folder, ListOrdered, type LucideProps } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { RouteId } from '$app/types';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { Component } from 'svelte';

	// Todo: Highlight active page better

	const navItem: {
		name: string;
		url: RouteId;
		icon: Component<LucideProps>;
	}[] = [
		{
			name: 'Parts',
			url: '/(authed)/(app)/parts',
			icon: Bolt
		},
		{
			name: 'Projects',
			url: '/(authed)/(app)/projects',
			icon: Folder
		},
		{
			name: 'Steps',
			url: '/(authed)/(app)/steps',
			icon: ListOrdered
		},
		{
			name: 'Setup',
			url: '/(authed)/(app)/setup',
			icon: Cog
		}
	];
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.Menu>
		{#each navItem as item (item.name)}
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
