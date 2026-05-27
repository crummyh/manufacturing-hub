<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import * as Card from '$lib/components/ui/card/index';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { KanbanPart } from '$lib/server/db/helpers/kanban';
	import { userAbbr } from '$lib/utils';
	import * as Avatar from '../ui/avatar/index';
	import Badge from '../ui/badge/badge.svelte';
	import { buttonVariants } from '../ui/button';
	import Button from '../ui/button/button.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import Spinner from '../ui/spinner/spinner.svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import MoveRight from '@lucide/svelte/icons/move-right';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Trash from '@lucide/svelte/icons/trash';
	import { toast } from 'svelte-sonner';

	let assigning = $state(false);
	async function assignToSelf() {
		assigning = true;
		const user = (await authClient.getSession()).data?.user;
		if (user !== undefined) {
			if (user.image === undefined) {
				user.image = null;
			}
			part.assignedTo = user;
		}

		try {
			await fetch(`dashboard/api/assign`, {
				method: 'PATCH',
				body: JSON.stringify({
					partID: part.id,
					userID: user?.id
				}),
				headers: { 'Content-Type': 'application/json' }
			});
		} catch {
			part.assignedTo = null;
			toast.error('Failed to assign part');
		} finally {
			assigning = false;
		}
	}

	interface Props {
		part: KanbanPart;
		[key: string]: unknown; // forwards draggable + droppable attachments from the page
	}

	let { part, ...props }: Props = $props();
</script>

<div
	class="kanban-card relative mb-2 cursor-grab rounded-md transition-[transform,box-shadow,opacity] duration-150 ease-in-out hover:translate-y-0.5 hover:shadow active:cursor-grabbing"
	{...props}
>
	<div
		class="insert-indicator pointer-events-none absolute inset-x-1 top-0 h-1 origin-center scale-x-[0.6] rounded-md bg-primary opacity-0 transition-[opacity,transform] duration-150 ease-in-out"
		aria-hidden="true"
	></div>

	<Card.Root class="gap-1">
		<Card.Header class="pb-2">
			<div class="flex items-center justify-between">
				<span class="text-sm leading-snug font-semibold">{part.name}</span>
				<Dialog.Root>
					<Dialog.Trigger
						type="button"
						class={buttonVariants({ variant: 'outline', size: 'icon-xs' })}
						><ChevronRight /></Dialog.Trigger
					>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>{part.name}</Dialog.Title>
							<Dialog.Description>
								{part.state?.name + ' - '}{part.createdAt?.toLocaleString()}
							</Dialog.Description>
						</Dialog.Header>
						<div>
							<div></div>
							<div>
								<Button variant="destructive"><Trash />Delete</Button>
								<Button variant="outline"><Pencil />Edit</Button>
							</div>
						</div>
					</Dialog.Content>
				</Dialog.Root>
			</div>
			<div class="flex shrink-0 flex-wrap gap-1">
				{#if part.project}
					<Badge variant="secondary">{part.project.name}</Badge>
				{/if}
				{#if part.type}
					<Badge variant="outline">{part.type.name}</Badge>
				{/if}
			</div>
		</Card.Header>

		<Card.Content>
			<Separator class="mb-3" />

			<div class="flex items-center justify-between text-xs text-muted-foreground">
				<span class="font-medium">{part.material?.name}</span>
				<span class="rounded bg-muted px-1.5 py-0.5 font-mono">{part.quantity}×</span>
			</div>

			<div class="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
				<MoveRight class="h-3 w-3 shrink-0" />
				{#if part.assignedTo}
					<Avatar.Root class="h-4 w-4">
						<Avatar.Image src={part.assignedTo.image} />
						<Avatar.Fallback class="text-[9px]">{userAbbr(part.assignedTo.name)}</Avatar.Fallback>
					</Avatar.Root>
					<span>{part.assignedTo.name}</span>
				{:else}
					<span>Unassigned</span>
					<a href="#assign" class="ml-auto text-primary hover:underline" onclick={assignToSelf}
						>{#if assigning}
							<Spinner />
						{:else}
							Assign me
						{/if}
					</a>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</div>

<style>
	.kanban-card:global(.dnd-dragging) {
		opacity: 0.35;
		transform: scale(0.97);
		cursor: grabbing;
		box-shadow: none;
	}

	.kanban-card:global(.dnd-over) .insert-indicator {
		opacity: 1;
		transform: scaleX(1);
	}

	.kanban-card:global(.dnd-over) {
		transform: none;
		box-shadow: none;
	}
</style>
