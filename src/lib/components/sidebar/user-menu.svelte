<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import UserAvatar from '../user-avatar.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import type { User } from 'better-auth';
	import { toggleMode } from 'mode-watcher';

	interface Props {
		user: User;
	}

	let { user }: Props = $props();

	async function signOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto(resolve('/'));
				}
			}
		});
	}

	let open = $state(false);
	const sidebar = useSidebar();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root bind:open>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex justify-between items-center"
					>
						<div class="flex items-center gap-2">
							<UserAvatar name={user.name} src={user.image} class="size-8" />
							<span class="truncate font-medium">{user.name}</span>
						</div>
						<ChevronDown class={['transition-transform', open && 'rotate-180']} />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label>
					<div class="flex items-center gap-2 px-1 py-1.5">
						<UserAvatar name={user.name} src={user.image} class="size-8" />
						<div class="grid flex-1 text-start text-sm leading-tight text-foreground">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={toggleMode}>
						<Sun class="scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90" />
						<Moon class="absolute scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0" />
						Change theme
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={signOut}>
						<LogOut />
						Log out
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
