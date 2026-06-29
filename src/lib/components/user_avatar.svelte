<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { userAbbr } from '$lib/utils';

	interface Props {
		name: string;
		image?: string | null;
	}

	let { name, image, ...restProps }: Props = $props();

	let fallback = $derived(userAbbr(name));
</script>

<Avatar.Root {...restProps}>
	<Avatar.Image src={image} alt={name} />
	<Avatar.AvatarFallback>{fallback}</Avatar.AvatarFallback>
</Avatar.Root>
