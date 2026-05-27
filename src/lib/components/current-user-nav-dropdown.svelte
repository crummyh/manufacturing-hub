<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { userAbbr } from '$lib/utils';
	import type { User } from 'better-auth';

	let { user }: { user: User } = $props();

	async function signOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto(resolve('/'));
				}
			}
		});
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="flex items-center rounded-md px-4 py-2 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted data-open:bg-muted/50 data-open:hover:bg-muted data-open:focus:bg-muted"
	>
		<Avatar.Root>
			<Avatar.Image src={user.image} alt={user.name} />
			<Avatar.Fallback>{userAbbr(user.name)}</Avatar.Fallback>
		</Avatar.Root>
		<span class="ps-2">
			{user.name}
		</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={signOut}>Sign out</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
