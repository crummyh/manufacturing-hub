<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { userAbbr } from '$lib/utils';
	import type { ComponentProps } from 'svelte';

	interface Props extends ComponentProps<typeof Avatar.Root> {
		name: string;
		src?: string | null;
	}

	let { name, src, ...restProps }: Props = $props();

	let fallback = $derived(userAbbr(name));
</script>

<Avatar.Root {...restProps}>
	<Avatar.Image {src} alt={name} />
	<Avatar.AvatarFallback>{fallback}</Avatar.AvatarFallback>
</Avatar.Root>
