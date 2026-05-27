/**
 * draggable.svelte.ts
 *
 * Svelte 5 attachments for the HTML Drag and Drop API with touch support via
 * the `@dragdroptouch/drag-drop-touch` npm package.
 *
 * Install the polyfill first:
 *   npm install @dragdroptouch/drag-drop-touch
 *
 * Usage
 * ─────
 *   import { draggable, droppable } from './draggable.svelte.ts';
 *
 *   <!-- Make an element draggable -->
 *   <div {@attach draggable({ data: item, group: 'cards' })}>…</div>
 *
 *   <!-- Make an element a drop target -->
 *   <div
 *     {@attach droppable({
 *       group: 'cards',
 *       onDrop(data, event) { … },
 *       onEnter(event) { … },
 *       onLeave(event) { … },
 *       onOver(event)  { … },
 *     })}
 *   >…</div>
 */
import { enableDragDropTouch } from '@dragdroptouch/drag-drop-touch';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Options accepted by the {@link draggable} attachment factory. */
export interface DraggableOptions<T = unknown> {
	/** Payload forwarded verbatim to the matching drop handler. */
	data: T;
	/**
	 * Logical drag group. A droppable only accepts items whose group matches its
	 * own. Defaults to `'default'`.
	 */
	group?: string;
	/**
	 * Value assigned to `DataTransfer.effectAllowed` on dragstart.
	 * Defaults to `'move'`.
	 */
	effectAllowed?: DataTransfer['effectAllowed'];
	/** Called immediately after the native `dragstart` event fires. */
	onDragStart?: (event: DragEvent) => void;
	/** Called immediately after the native `dragend` event fires. */
	onDragEnd?: (event: DragEvent) => void;
}

/** Options accepted by the {@link droppable} attachment factory. */
export interface DroppableOptions<T = unknown> {
	/**
	 * Must match the `group` of draggable items you want this target to accept.
	 * Defaults to `'default'`.
	 */
	group?: string;
	/**
	 * Value assigned to `DataTransfer.dropEffect` on dragover.
	 * Defaults to `'move'`.
	 */
	dropEffect?: DataTransfer['dropEffect'];
	/** Called when a compatible item is dropped onto this element. */
	onDrop: (data: T, event: DragEvent) => void;
	/** Called on the first `dragenter` after the pointer crosses the boundary. */
	onEnter?: (event: DragEvent) => void;
	/** Called on `dragleave` once the pointer fully leaves the boundary. */
	onLeave?: (event: DragEvent) => void;
	/** Called on every `dragover` tick while the pointer is inside. */
	onOver?: (event: DragEvent) => void;
}

/** Svelte 5 attachment: a function that receives an element and returns a cleanup function. */
type Attachment = (element: HTMLElement) => () => void;

// ─── Polyfill bootstrap ──────────────────────────────────────────────────────

// enableDragDropTouch is idempotent per element pair, so calling it once for
// the whole document is all we need.  We guard with a flag so it only runs
// once no matter how many attachments are mounted.
let polyfillEnabled = false;

function ensurePolyfill(): void {
	if (polyfillEnabled) return;
	polyfillEnabled = true;
	enableDragDropTouch(document, document, { forceListen: true });
}

// ─── In-flight drag state ────────────────────────────────────────────────────

/** Shared mutable state for the item currently being dragged. */
interface FlightState {
	data: unknown;
	group: string;
}

const flight: FlightState = {
	data: undefined,
	group: 'default'
};

// ─── draggable ───────────────────────────────────────────────────────────────

/**
 * Svelte 5 attachment factory — makes an element draggable.
 *
 * @example
 * ```svelte
 * <div {@attach draggable({ data: card, group: 'kanban' })}>
 *   {card.title}
 * </div>
 * ```
 */
export function draggable<T = unknown>(opts: DraggableOptions<T>): Attachment {
	return function attach(element: HTMLElement): () => void {
		ensurePolyfill();

		element.setAttribute('draggable', 'true');

		function onDragStart(event: DragEvent): void {
			const { data, group = 'default', effectAllowed = 'move', onDragStart: cb } = opts;

			flight.data = data;
			flight.group = group;

			// Store the group in dataTransfer so droppable targets can read it during
			// dragenter/dragover (the DnD API restricts arbitrary data reads to those
			// events only within the same origin, but group is safe plain text).
			event.dataTransfer!.effectAllowed = effectAllowed;
			event.dataTransfer!.setData('text/x-dnd-group', group);

			element.classList.add('dnd-dragging');
			cb?.(event);
		}

		function onDragEnd(event: DragEvent): void {
			element.classList.remove('dnd-dragging');
			opts.onDragEnd?.(event);
		}

		element.addEventListener('dragstart', onDragStart);
		element.addEventListener('dragend', onDragEnd);

		// Returned cleanup is called by Svelte when the element unmounts.
		return (): void => {
			element.removeEventListener('dragstart', onDragStart);
			element.removeEventListener('dragend', onDragEnd);
			element.removeAttribute('draggable');
		};
	};
}

// ─── droppable ───────────────────────────────────────────────────────────────

/**
 * Svelte 5 attachment factory — makes an element a drop target.
 *
 * @example
 * ```svelte
 * <div
 *   {@attach droppable({
 *     group: 'kanban',
 *     onDrop(card, event) { moveCard(card, column.id); },
 *   })}
 * >
 *   …cards…
 * </div>
 * ```
 */
export function droppable<T = unknown>(opts: DroppableOptions<T>): Attachment {
	return function attach(element: HTMLElement): () => void {
		ensurePolyfill();

		// Count nested dragenter/dragleave events so we only fire our callbacks
		// when the pointer truly crosses the element's outer boundary.
		let enterCount = 0;

		function groupMatches(event: DragEvent): boolean {
			const { group = 'default' } = opts;
			// During dragover the dataTransfer read may return '' depending on browser,
			// so fall back to the in-memory flight state (same-page drags only).
			const inboundGroup = event.dataTransfer!.getData('text/x-dnd-group') || flight.group;
			return inboundGroup === group;
		}

		function onDragEnter(event: DragEvent): void {
			if (!groupMatches(event)) return;
			enterCount++;
			if (enterCount === 1) {
				element.classList.add('dnd-over');
				opts.onEnter?.(event);
			}
			event.preventDefault();
		}

		function onDragOver(event: DragEvent): void {
			if (!groupMatches(event)) return;
			event.dataTransfer!.dropEffect = opts.dropEffect ?? 'move';
			event.preventDefault(); // required — tells the browser a drop is allowed
			opts.onOver?.(event);
		}

		function onDragLeave(event: DragEvent): void {
			if (!groupMatches(event)) return;
			enterCount--;
			if (enterCount === 0) {
				element.classList.remove('dnd-over');
				opts.onLeave?.(event);
			}
		}

		function onDrop(event: DragEvent): void {
			event.preventDefault();
			enterCount = 0;
			element.classList.remove('dnd-over');

			if (!groupMatches(event)) return;

			opts.onDrop(flight.data as T, event);

			// Clear in-flight state after delivery.
			flight.data = undefined;
			flight.group = 'default';
		}

		element.addEventListener('dragenter', onDragEnter);
		element.addEventListener('dragover', onDragOver);
		element.addEventListener('dragleave', onDragLeave);
		element.addEventListener('drop', onDrop);

		return (): void => {
			element.removeEventListener('dragenter', onDragEnter);
			element.removeEventListener('dragover', onDragOver);
			element.removeEventListener('dragleave', onDragLeave);
			element.removeEventListener('drop', onDrop);
		};
	};
}
