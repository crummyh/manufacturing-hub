<script lang="ts">
	import { droppable, draggable } from '$lib/attachments/draggable.svelte';
	import DashboardTopNav from '$lib/components/dashboard-top-nav.svelte';
	import KanbanCard from '$lib/components/kanban/kanban-card.svelte';
	import KanbanCol from '$lib/components/kanban/kanban-col.svelte';
	import SearchableSelect from '$lib/components/searchable-select.svelte';
	import type { KanbanPart } from '$lib/server/db/helpers/kanban';
	import type { PageData } from './$types';
	import { generateKeyBetween } from 'fractional-indexing';

	let { data }: { data: PageData } = $props();

	// Mirror server data into local reactive state so moves update the UI
	// immediately without waiting for a server round-trip.
	// eslint-disable-next-line svelte/prefer-writable-derived
	let cols = $state(data.cols.map((c) => ({ ...c, parts: [...c.parts] })));

	$effect(() => {
		cols = data.cols.map((c) => ({ ...c, parts: [...c.parts] }));
	});

	let filterProject = $state('');
	let filterMaterial = $state('');
	let filterThickness = $state('');

	const filteredCols = $derived(
		cols.map((col) => ({
			...col,
			parts: col.parts.filter((p) => {
				if (filterProject && String(p.projectId) !== filterProject) return false;
				if (filterMaterial && String(p.materialId) !== filterMaterial) return false;
				if (filterThickness && String(p.thicknessId) !== filterThickness) return false;
				return true;
			})
		}))
	);

	const totalParts = $derived(cols.reduce((sum, col) => sum + col.parts.length, 0));
	const visibleParts = $derived(filteredCols.reduce((sum, col) => sum + col.parts.length, 0));

	/** Remove a part from whichever column currently holds it, returning it. */
	function extractPart(partId: number): KanbanPart | undefined {
		for (const col of cols) {
			const idx = col.parts.findIndex((p) => p.id === partId);
			if (idx !== -1) {
				const [removed] = col.parts.splice(idx, 1);
				return removed;
			}
		}
	}

	/**
	 * Move a card to a different column (appended at the end).
	 * Persists both the new stateId and a new order value.
	 */
	async function moveCard(partId: number, targetColId: number) {
		const movedPart = extractPart(partId);
		if (!movedPart) return;

		const target = cols.find((c) => c.id === targetColId);
		if (!target) return;

		const newOrder = generateKeyBetween(target.parts.at(-1)?.order ?? null, null);

		movedPart.order = newOrder;
		target.parts.push(movedPart);

		await fetch('dashboard/api/move', {
			method: 'PATCH',
			body: JSON.stringify({ targetID: target.id, partID: movedPart.id, order: newOrder }),
			headers: { 'content-type': 'application/json' }
		});
	}

	/**
	 * Insert a dragged card directly before a target card (within the same column
	 * or across columns). Uses midpoint ordering so only the moved card's `order`
	 * value ever changes.
	 */
	async function reorderCard(draggedPartId: number, beforePartId: number) {
		if (draggedPartId === beforePartId) return;

		const movedPart = extractPart(draggedPartId);
		if (!movedPart) return;

		// Find the column and index of the target card (after removal of dragged).
		let targetCol: (typeof cols)[number] | undefined;
		let beforeIdx = -1;
		for (const col of cols) {
			const idx = col.parts.findIndex((p) => p.id === beforePartId);
			if (idx !== -1) {
				targetCol = col;
				beforeIdx = idx;
				break;
			}
		}

		if (!targetCol || beforeIdx === -1) {
			return;
		}

		const before = targetCol.parts[beforeIdx];
		const above = targetCol.parts[beforeIdx - 1];
		const newOrder = generateKeyBetween(above?.order ?? null, before.order);

		movedPart.order = newOrder;
		targetCol.parts.splice(beforeIdx, 0, movedPart);

		await fetch('dashboard/api/move', {
			method: 'PATCH',
			body: JSON.stringify({
				targetID: targetCol.id,
				partID: movedPart.id,
				order: newOrder
			}),
			headers: { 'content-type': 'application/json' }
		});
	}
</script>

<DashboardTopNav
	user={data.user}
	manualPartForm={data.manualPartForm}
	thicknesses={data.thicknesses}
	materials={data.materials}
	finishes={data.finishes}
/>

<div class="flex h-14 max-w-screen items-center justify-between bg-background px-4">
	<div class="flex items-center gap-3">
		<span class="opacity-75">Filter:</span>
		<SearchableSelect
			options={data.projects.map((p) => ({ value: String(p.id), label: p.name }))}
			bind:value={filterProject}
			placeholder="All projects"
			clearOption
		/>
		<SearchableSelect
			options={data.materials.map((m) => ({ value: String(m.id), label: m.name }))}
			bind:value={filterMaterial}
			placeholder="All materials"
			clearOption
		/>
		<SearchableSelect
			options={data.thicknesses.map((t) => ({ value: String(t.id), label: t.name }))}
			bind:value={filterThickness}
			placeholder="All thicknesses"
			clearOption
		/>
	</div>
	<div>
		<span>{visibleParts} of {totalParts} parts</span>
	</div>
</div>

<div class="flex gap-3 overflow-x-auto px-3 pt-3 pb-6">
	{#each filteredCols as col (col.id)}
		<KanbanCol
			{col}
			{@attach droppable({
				group: 'kanban',
				onDrop(partId: number) {
					moveCard(partId, col.id);
				}
			})}
		>
			{#each col.parts as part (part.id)}
				<KanbanCard
					{part}
					{@attach draggable({ data: part.id, group: 'kanban' })}
					{@attach droppable({
						group: 'kanban',
						onDrop(draggedPartId: number) {
							reorderCard(draggedPartId, part.id);
						}
					})}
				/>
			{/each}
		</KanbanCol>
	{/each}
</div>
