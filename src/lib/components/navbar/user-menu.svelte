<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';
	import UserAvatar from '../user-avatar.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
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
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger
		class="gap-1 flex items-center text-sm rounded-md p-2 hover:bg-muted data-[state=open]:bg-muted/50 data-[state=open]:hover:bg-muted"
	>
		<UserAvatar name={user.name} src={user.image} />
		<ChevronDown class={['transition-transform', open && 'rotate-180']} />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-40">
		<DropdownMenu.Group>
			<DropdownMenu.Item onclick={toggleMode}>
				<Sun class="scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90" />
				<Moon class="absolute scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0" />
				Change theme
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={signOut}>Log out</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
