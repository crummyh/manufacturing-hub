<script lang="ts">
	import { page } from '$app/state';
	import LoginCard from '$lib/components/cards/login.svelte';
	import { onMount } from 'svelte';

	let redirectUrl = $state('/');

	onMount(() => {
		const params = page.url.searchParams;
		const return_url = params.get('return');
		if (return_url) {
			redirectUrl = page.url.origin + return_url;
		}
	});
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<LoginCard {redirectUrl}></LoginCard>
</div>
