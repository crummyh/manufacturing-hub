<script lang="ts">
	import { page } from '$app/state';
	import LoginCard from '$lib/components/login-card.svelte';
	import { onMount } from 'svelte';

	let redirectUrl = $state('/dashboard');

	onMount(() => {
		const params = page.url.searchParams;
		const return_url = params.get('return');
		if (return_url !== null) {
			redirectUrl = decodeURIComponent(return_url);
		}
	});
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<LoginCard {redirectUrl}></LoginCard>
</div>
