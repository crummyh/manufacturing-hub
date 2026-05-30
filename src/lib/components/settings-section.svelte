<script lang="ts">
	import Separator from './ui/separator/separator.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		name: string;
		description: string;
		children: Snippet;
	}

	let { name, description, children }: Props = $props();
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-lg font-semibold">{name}</h2>
		<p class="text-sm text-muted-foreground">{description}</p>
	</div>
	<Separator />
	{@render children()}
</div>
