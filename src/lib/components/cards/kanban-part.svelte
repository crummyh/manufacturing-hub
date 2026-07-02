<script lang="ts">
	import { resolve } from '$app/paths';
	import * as ButtonGroup from '$lib/components/ui/button-group';
	import * as Card from '$lib/components/ui/card/index';
	import Badge from '../ui/badge/badge.svelte';
	import Button from '../ui/button/button.svelte';
	import UserAvatar from '../user-avatar.svelte';
	import Check from '@lucide/svelte/icons/check';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	interface Props {
		part: unknown;
		critical?: boolean;
		done?: boolean;
	}

	// Todo: actually take a part
	let { part, critical, done }: Props = $props();

	// Todo: Open details view on click, and project view on project button
</script>

<Card.Root
	class={[
		'transition-transform w-xs hover:shadow hover:translate-y-0.5',
		critical && 'border-4 border-primary'
	]}
>
	<Card.Header>
		<Card.Title class="truncate">Intake Side Plate</Card.Title>
		<Card.Description class="text-foreground flex gap-2 -ms-0.5 justify-between">
			<Badge href={resolve('/(authed)/(app)/projects')} variant="secondary">Comp Intake</Badge>
			<Badge variant="secondary" class="tabular-nums">4x</Badge>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex gap-1.5 items-center">
			<span class="text-sm">Assignee:</span>
			<UserAvatar name="John Doe" class="size-6 text-xs"></UserAvatar>
			<span>John Doe</span>
		</div>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline">Details</Button>
		<ButtonGroup.Root>
			{#if done}
				<Button size="icon" variant="outline"><Check /></Button>
			{/if}
			<Button size="icon" variant="outline"><ChevronLeft /></Button>
			<Button size="icon" variant="outline"><ChevronRight /></Button>
		</ButtonGroup.Root>
	</Card.Footer>
</Card.Root>
