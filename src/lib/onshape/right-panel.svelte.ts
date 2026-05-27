import { checkPostMessage, getOnshapeIdsFromUrl, sendMessage, type OnshapeIds } from './core';
import { writable, type Writable } from 'svelte/store';

export interface Selection {
	entityType: string;
	occurrencePath: string | undefined;
	selectionId: string;
	selectionType: string;
	workspaceMicroversionId: string;
}

export enum SelectionType {
	Vertex = 'VERTEX',
	Edge = 'EDGE',
	Face = 'FACE',
	Body = 'BODY',
	DegenerateEdge = 'DEGENERATE_EDGE',
	Unknown = 'UNKNOWN'
}

let onshapeIds: OnshapeIds | undefined = $state();
export const selections: Writable<Selection[]> = writable([]);
export const requestedSelections: Writable<Selection[]> = writable([]);

export function getIDs() {
	return onshapeIds;
}

let requestSelectionId: number = $state(0);

// Initializes the Onshape app. Make sure this is called
// on mount rather then on load time.
export function init() {
	onshapeIds = getOnshapeIdsFromUrl(window.location.href);

	sendMessage('applicationInit', onshapeIds);
}

export function sendBlueBubble(message: string) {
	if (!onshapeIds) {
		throw new Error('You must run `init` before sending messages');
	}

	sendMessage('showMessageBubble', onshapeIds, { message: message });
}

export function handleMessage(event: MessageEvent) {
	if (!checkPostMessage(event)) {
		return;
	}

	switch (event.data.messageName) {
		case 'SELECTION':
			selections.set(event.data.selections);
			break;

		case 'REQUESTED_SELECTION':
			requestedSelections.set(event.data.selections);
			break;

		default:
			console.debug(`${event.data.messageName} is not handled`);
	}
}

export function requestSelection(
	entityTypeSpecifier: SelectionType[],
	requiredSelectionCount?: number
) {
	if (!onshapeIds) {
		throw new Error('You must run `init` before sending messages');
	}

	if (requiredSelectionCount) {
		sendMessage('requestSelection', onshapeIds, {
			entityTypeSpecifier: entityTypeSpecifier,
			messageId: requestSelectionId.toString(),
			requiredSelectionCount: requiredSelectionCount
		});
	} else {
		sendMessage('requestSelection', onshapeIds, {
			entityTypeSpecifier: entityTypeSpecifier,
			messageId: requestSelectionId.toString(),
			requiredSelectionCount: 0
		});
	}

	requestSelectionId++;
}
