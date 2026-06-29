<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import CurrentUserNavDropdown from '$lib/components/current-user-nav-dropdown.svelte';
	import Account from '$lib/components/settings/account.svelte';
	import Manufacturing from '$lib/components/settings/manufacturing.svelte';
	import Notifications from '$lib/components/settings/notifications.svelte';
	import Profile from '$lib/components/settings/profile.svelte';
	import { Separator } from '$lib/components/ui/separator/index';
	import type { PageData } from './$types';
	import { type LucideIcon } from '@lucide/svelte';
	import BellIcon from '@lucide/svelte/icons/bell';
	import CogIcon from '@lucide/svelte/icons/cog';
	import KeyRoundIcon from '@lucide/svelte/icons/key-round';
	import UserIcon from '@lucide/svelte/icons/user';

	let { data }: { data: PageData } = $props();

	type SectionId = 'profile' | 'account' | 'notifications' | 'manufacturing';

	const sections: { id: SectionId; label: string; Icon: LucideIcon }[] = [
		{ id: 'profile', label: 'Profile', Icon: UserIcon },
		{ id: 'account', label: 'Account', Icon: KeyRoundIcon },
		{ id: 'notifications', label: 'Notifications', Icon: BellIcon },
		{ id: 'manufacturing', label: 'Manufacturing', Icon: CogIcon }
	];

	const activeSection = $derived<SectionId>(
		(page.url.searchParams.get('section') as SectionId) ?? 'profile'
	);
</script>

<header class="border-b bg-background">
	<div class="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
		<div class="flex items-center gap-6">
			<a href={resolve('/')} class="text-sm font-semibold">MyApp</a>
			<h1 class="underline">Settings</h1>
		</div>
		<CurrentUserNavDropdown user={data.user} />
	</div>
</header>

<div class="mx-auto max-w-screen-xl px-4 py-8">
	<div class="flex gap-8">
		<!-- Sidebar nav -->
		<nav class="w-48 shrink-0">
			<ul class="flex flex-col gap-1">
				{#each sections as { id, label, Icon } (id)}
					<li>
						<a
							href={resolve(`/settings?section=${id}`)}
							class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted {activeSection ===
							id
								? 'bg-muted font-medium text-foreground'
								: 'text-muted-foreground'}"
						>
							<Icon class="size-4" />
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<Separator orientation="vertical" class="h-auto" />

		<!-- Section content -->
		<main class="min-w-0 flex-1">
			{#if activeSection === 'profile'}
				<Profile data={data} />
			{:else if activeSection === 'account'}
				<Account data={data} />
			{:else if activeSection === 'notifications'}
				<Notifications data={data} />
			{:else if activeSection === 'manufacturing'}
				<Manufacturing data={data} />
			{/if}
		</main>
	</div>
</div>
