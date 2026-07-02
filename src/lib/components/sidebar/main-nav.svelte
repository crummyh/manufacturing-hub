<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Folder from '@lucide/svelte/icons/folder';
	import SquareKanban from '@lucide/svelte/icons/square-kanban';
	import Table from '@lucide/svelte/icons/table';

	const navItem = [
		{
			name: 'Overview',
			url: resolve('/(authed)/(app)/overview'),
			icon: SquareKanban
		},
		{
			name: 'Table',
			url: resolve('/(authed)/(app)/table'),
			icon: Table
		},
		{
			name: 'Projects',
			url: resolve('/(authed)/(app)/projects'),
			icon: Folder
		}
	];
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.Menu>
		{#each navItem as item (item.name)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href={item.url} {...props}>
							<item.icon />
							<span>{item.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
