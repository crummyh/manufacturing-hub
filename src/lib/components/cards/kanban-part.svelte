<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import * as ButtonGroup from '$lib/components/ui/button-group';
	import * as Card from '$lib/components/ui/card/index';
	import type { KanbanPart } from '../../../routes/(authed)/(app)/overview/[...filters]/schemas';
	import Badge from '../ui/badge/badge.svelte';
	import Button, { buttonVariants } from '../ui/button/button.svelte';
	import UserAvatar from '../user-avatar.svelte';
	import { Check, ChevronLeft, ChevronRight } from '@lucide/svelte';

	interface Props {
		part: KanbanPart;
		nextState?: string;
		lastState?: string;
		removePart(id: string): void;
	}

	let { part, nextState, lastState, removePart }: Props = $props();

	// Todo: Open details view on click, and project view on project button
</script>

<Card.Root
	class={[
		'transition-transform w-xs hover:shadow hover:translate-y-0.5',
		part.critical && 'border-4 border-primary'
	]}
>
	<Card.Header>
		<Card.Title class="truncate">{part.name}</Card.Title>
		<Card.Description class="text-foreground flex gap-2 -ms-0.5 justify-between">
			{#if part.project}
				<Badge href={resolve('/(authed)/(app)/projects')} variant="secondary"
					>{part.project.name}</Badge
				>
			{:else}
				<div></div>
			{/if}
			<Badge variant="secondary" class="tabular-nums">{part.quantity}x</Badge>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if part.assignee}
			<div class="flex gap-1.5 items-center">
				<span class="text-sm">Assignee:</span>
				<UserAvatar name={part.assignee.name} src={part.assignee.image} class="size-6 text-xs"
				></UserAvatar>
				<span>{part.assignee.name}</span>
			</div>
		{/if}
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<a
			class={buttonVariants({ variant: 'outline' })}
			href={resolve('/(authed)/(app)/part/[partId]', { partId: part.id })}>Details</a
		>
		<ButtonGroup.Root>
			{#if lastState}
				<form
					method="POST"
					action="?/movePart"
					use:enhance={() => {
						removePart(part.id);
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<input type="hidden" name="partId" value={part.id} />
					<input type="hidden" name="newStateId" value={lastState} />
					<Button size="icon" variant="outline" type="submit" aria-label="Move left"
						><ChevronLeft /></Button
					>
				</form>
			{/if}
			{#if nextState}
				<form
					method="POST"
					action="?/movePart"
					use:enhance={() => {
						removePart(part.id);
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<input type="hidden" name="partId" value={part.id} />
					<input type="hidden" name="newStateId" value={nextState} />
					<Button size="icon" variant="outline" type="submit" aria-label="Move right"
						><ChevronRight /></Button
					>
				</form>
			{:else}
				<form
					method="POST"
					action="?/archivePart"
					use:enhance={() => {
						removePart(part.id);
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<input type="hidden" name="partId" value={part.id} />
					<Button size="icon" variant="outline" type="submit" aria-label="Archive part"
						><Check /></Button
					>
				</form>
			{/if}
		</ButtonGroup.Root>
	</Card.Footer>
</Card.Root>
