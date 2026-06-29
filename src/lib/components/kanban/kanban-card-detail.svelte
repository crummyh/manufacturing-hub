<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { KanbanPart } from '$lib/server/db/helpers/kanban';
	import Button from '../ui/button/button.svelte';
	import UserAvatar from '../user_avatar.svelte';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Trash from '@lucide/svelte/icons/trash';

	interface Props {
		part: KanbanPart;
	}

	let { part }: Props = $props();
</script>

<Dialog.Content>
	<Dialog.Header>
		<Dialog.Title>{part.name}</Dialog.Title>
		<Dialog.Description>
			{part.state?.name + ' - '}{part.createdAt?.toLocaleString()}
		</Dialog.Description>
	</Dialog.Header>
	<div>
		<div class="flex flex-col gap-2">
			<div>
				<div class="text-xs text-muted-foreground">Material</div>
				<div>{part.material ? part.material.name : 'None'}</div>
			</div>
			<div>
				<div class="text-xs text-muted-foreground">Thickness</div>
				<div>{part.thickness ? part.thickness.name : 'None'}</div>
			</div>
			<div>
				<div class="text-xs text-muted-foreground">Finish</div>
				<div>{part.finish ? part.finish.name : 'None'}</div>
			</div>
			<div>
				<div class="text-xs text-muted-foreground">Assignee</div>
				<div class="flex gap-1.5 items-center">
					{#if part.assignedTo}
						<UserAvatar name={part.assignedTo.name} image={part.assignedTo.image} class="h-5 w-5" />
						<div>{part.assignedTo.name}</div>
					{:else}
						None
					{/if}
				</div>
			</div>
		</div>
		<div class="mt-4">
			<Button variant="destructive"><Trash />Delete</Button>
			<Button variant="outline"><Pencil />Edit</Button>
		</div>
	</div>
</Dialog.Content>
