<script lang="ts">
	import KanbanPart from '$lib/components/cards/kanban-part.svelte';
</script>

<h1>Main Page</h1>
<div class="flex flex-col gap-4">
	<KanbanPart part={{}} />
	<KanbanPart part={{}} critical />
	<KanbanPart part={{}} done />
	<KanbanPart part={{}} critical done />
</div>
