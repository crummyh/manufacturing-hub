import {
	checkPostMessage,
	getOnshapeIdsFromUrl,
	SelectionType,
	sendMessage,
	type OnshapeIds
} from './core';

export interface Selection {
	entityType: string;
	occurrencePath: string | undefined;
	selectionId: string;
	selectionType: string;
	workspaceMicroversionId: string;
}

export class RightPanelClient {
	onshapeIds: OnshapeIds;
	selections: Selection[];
	requestedSelections: Selection[];
	requestSelectionId: number;

	constructor(urlParams: URLSearchParams) {
		this.selections = $state([]);
		this.requestedSelections = $state([]);
		this.requestSelectionId = $state(0);

		this.onshapeIds = $state(getOnshapeIdsFromUrl(urlParams));
		sendMessage('applicationInit', this.onshapeIds);
	}

	handleMessage(event: MessageEvent) {
		if (!checkPostMessage(event)) {
			return;
		}

		switch (event.data.messageName) {
			case 'SELECTION':
				this.selections = event.data.selections;
				break;

			case 'REQUESTED_SELECTION':
				this.requestedSelections = event.data.selections;
				break;

			default:
				console.debug(`${event.data.messageName} is not handled`);
		}
	}

	sendBlueBubble(message: string) {
		sendMessage('showMessageBubble', this.onshapeIds, { message: message });
	}

	requestSelection(entityTypeSpecifier: SelectionType[], requiredSelectionCount?: number) {
		sendMessage('requestSelection', this.onshapeIds, {
			entityTypeSpecifier: entityTypeSpecifier,
			messageId: this.requestSelectionId.toString(),
			requiredSelectionCount: requiredSelectionCount ? requiredSelectionCount : 0
		});
		this.requestSelectionId++;
	}
}
