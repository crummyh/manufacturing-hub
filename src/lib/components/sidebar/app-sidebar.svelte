<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import MainLogo from '../main-logo.svelte';
	import MainNav from './main-nav.svelte';
	import UserMenu from './user-menu.svelte';
	import type { User } from 'better-auth';
	import type { ComponentProps } from 'svelte';

	interface Props extends ComponentProps<typeof Sidebar.Root> {
		user: User;
	}

	let { user, ...restProps }: Props = $props();
</script>

<Sidebar.Root variant="sidebar" collapsible="none" class="h-screen" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="##" {...props}>
							<MainLogo />
							<span class="font-bold">Manufacturing Hub</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<MainNav />
	</Sidebar.Content>
	<Sidebar.Footer class="">
		<UserMenu {user} />
	</Sidebar.Footer>
</Sidebar.Root>
