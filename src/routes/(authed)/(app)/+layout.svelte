<script lang="ts">
	import BaseNav from '$lib/components/navbar/base-nav.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<BaseNav user={data.user} />
{@render children()}
