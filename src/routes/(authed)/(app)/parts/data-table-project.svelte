<script lang="ts">
	import { ChevronRight, Plus } from '@lucide/svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';

	interface Props {
		id?: number;
		name?: string;
	}

	let { id, name }: Props = $props();
</script>

{#if id}
	<a class={[buttonVariants({ variant: 'ghost' }), 'group']} href="#">
		{name}
		<ChevronRight class="size-4 transition-opacity group-hover:opacity-100 opacity-0" />
	</a>
{:else}
	<a class={[buttonVariants({ variant: 'ghost' }), 'group']} href="#">
		<Plus class="size-4 transition-opacity group-hover:opacity-100 opacity-0" />
	</a>
{/if}
