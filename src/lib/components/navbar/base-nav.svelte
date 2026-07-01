<script lang="ts">
	import { page } from '$app/state';
	import MainLogo from '../main-logo.svelte';
	import UserMenu from './user-menu.svelte';
	import type { User } from 'better-auth';

	interface Props {
		user: User;
	}

	let { user }: Props = $props();
</script>

<header
	class="bg-background sticky top-0 z-50 w-full h-14 px-4 flex items-center justify-between border-b-border border-b"
>
	<!-- Left -->
	<div class="flex gap-2 items-center">
		<MainLogo />
		<span class="text-lg font-bold">Manufacturing Hub</span>
	</div>

	<!-- Right -->
	<div class="flex gap-2 items-center">
		{#if page.route.id === '/'}
			<span>Main Page</span>
		{/if}
		<UserMenu {user} />
	</div>
</header>
