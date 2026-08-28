<script lang="ts" generics="T">
	import { cn } from '$lib/utils.js';
	import { tick, type Snippet } from 'svelte';

	import ReorderableItem from './reorderable-item.svelte';

	/**
	 * Props spread onto whatever element you want to act as the drag handle
	 * (typically a `<ReorderableHandle {...handleProps} />`).
	 */
	type HandleProps = {
		onpointerdown: (event: PointerEvent) => void;
		onkeydown: (event: KeyboardEvent) => void;
		tabindex: number;
		role: 'button';
		'aria-roledescription': string;
		'aria-disabled': boolean;
		'data-dragging': boolean;
		'data-slot': 'reorderable-handle';
	};

	type ItemSnippetProps = {
		dragging: boolean;
		handleProps: HandleProps;
	};

	type Props = {
		/** The items to render and reorder. Reassigned (not mutated) whenever the order changes. */
		items: T[];
		/** A stable, unique key for an item — used for keyed rendering and to track identity while dragging. */
		key: (item: T, index: number) => string | number;
		/**
		 * Renders one row's content. Receives the item, its current index, and
		 * `{ dragging, handleProps }` — spread `handleProps` onto your own drag handle element.
		 */
		item: Snippet<[T, number, ItemSnippetProps]>;
		/** Disables all dragging and reordering, including via keyboard. */
		disabled?: boolean;
		class?: string;
		/** Fired with the new array whenever the order changes (pointer drag or keyboard move). */
		onreorder?: (items: T[]) => void;
	};

	let {
		items = $bindable(),
		key,
		item: itemSnippet,
		disabled = false,
		class: className,
		onreorder
	}: Props = $props();

	let draggingIndex = $state<number | null>(null);
	let activePointerId: number | null = null;
	let rowEls: (HTMLLIElement | null | undefined)[] = [];
	let announcement = $state('');

	function reorder(from: number, to: number) {
		if (from === to || to < 0 || to >= items.length) return;
		const next = items.slice();
		const [moved] = next.splice(from, 1);
		next.splice(to, 0, moved);
		items = next;
		onreorder?.(next);
	}

	function onHandlePointerDown(index: number, event: PointerEvent) {
		if (disabled) return;
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		event.preventDefault();
		draggingIndex = index;
		activePointerId = event.pointerId;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
		window.addEventListener('pointercancel', onPointerUp);
	}

	function onPointerMove(event: PointerEvent) {
		if (draggingIndex === null || event.pointerId !== activePointerId) return;
		const { clientY } = event;

		// Walk upward: swap with the previous row while the pointer is above its midpoint.
		while (draggingIndex > 0) {
			const prevEl = rowEls[draggingIndex - 1];
			if (!prevEl) break;
			const prevRect = prevEl.getBoundingClientRect();
			const prevMid = prevRect.top + prevRect.height / 2;
			if (clientY >= prevMid) break;
			reorder(draggingIndex, draggingIndex - 1);
			draggingIndex -= 1;
		}

		// Walk downward: swap with the next row while the pointer is below its midpoint.
		while (draggingIndex < items.length - 1) {
			const nextEl = rowEls[draggingIndex + 1];
			if (!nextEl) break;
			const nextRect = nextEl.getBoundingClientRect();
			const nextMid = nextRect.top + nextRect.height / 2;
			if (clientY <= nextMid) break;
			reorder(draggingIndex, draggingIndex + 1);
			draggingIndex += 1;
		}
	}

	function onPointerUp(event: PointerEvent) {
		if (event.pointerId !== activePointerId) return;
		cleanupDrag();
	}

	function cleanupDrag() {
		draggingIndex = null;
		activePointerId = null;
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);
		window.removeEventListener('pointercancel', onPointerUp);
	}

	async function onHandleKeyDown(index: number, event: KeyboardEvent) {
		if (disabled) return;
		if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
		event.preventDefault();
		const to = index + (event.key === 'ArrowUp' ? -1 : 1);
		if (to < 0 || to >= items.length) return;
		reorder(index, to);
		announcement = `Moved item to position ${to + 1} of ${items.length}`;
		await tick();
		(rowEls[to]?.querySelector('[data-slot="reorderable-handle"]') as HTMLElement | null)?.focus();
	}

	function handlePropsFor(index: number): HandleProps {
		return {
			onpointerdown: (e) => onHandlePointerDown(index, e),
			onkeydown: (e) => onHandleKeyDown(index, e),
			tabindex: disabled ? -1 : 0,
			role: 'button',
			'aria-roledescription': 'Sortable item. Use arrow keys to reorder.',
			'aria-disabled': disabled,
			'data-dragging': draggingIndex === index,
			'data-slot': 'reorderable-handle'
		};
	}
</script>

<ul class={cn('flex flex-col gap-1.5', className)} data-slot="reorderable">
	{#each items as entry, index (key(entry, index))}
		<ReorderableItem bind:el={rowEls[index]} dragging={draggingIndex === index}>
			{@render itemSnippet(entry, index, {
				dragging: draggingIndex === index,
				handleProps: handlePropsFor(index)
			})}
		</ReorderableItem>
	{/each}
</ul>

<!-- Screen-reader announcement for keyboard reordering -->
<div class="sr-only" aria-live="polite">{announcement}</div>
