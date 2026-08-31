<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import UserAvatar from '$lib/components/user-avatar.svelte';

	interface Props {
		id?: string;
		name?: string;
		image?: string | null;
	}

	let { id, name, image }: Props = $props();
</script>

{#if id && name}
	<div class="flex items-center gap-1">
		<UserAvatar {name} src={image} class="size-6"></UserAvatar>
		{name}
	</div>
{:else}
	<Button variant="ghost" class="opacity-0 hover:opacity-100 transition-opacity">Assign me</Button>
{/if}
