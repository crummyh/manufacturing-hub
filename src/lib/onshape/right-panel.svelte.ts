import { OnshapeAppClient, SelectionType } from './core';

export interface Selection {
	entityType: string;
	occurrencePath: string | undefined;
	selectionId: string;
	selectionType: string;
	workspaceMicroversionId: string;
}

export class RightPanelClient extends OnshapeAppClient {
	selections: Selection[] = $state([]);
	requestedSelections: Selection[] = $state([]);
	requestSelectionId: number = $state(0);

	onRequestCompletionCallbacks: ((selections: Selection[]) => void)[] = [];

	constructor(urlParams: URLSearchParams) {
		super(urlParams);
		this.sendMessage('applicationInit');
	}

	handleMessage(event: MessageEvent) {
		if (!this.checkPostMessage(event)) {
			return;
		}

		switch (event.data.messageName) {
			case 'SELECTION':
				this.selections = event.data.selections;
				break;

			case 'REQUESTED_SELECTION':
				if (event.data.status?.statusCode === 'SUCCESS') {
					this.onRequestCompletionCallbacks.forEach((fn) => fn(event.data.selections));
				}

				if (event.data.selections) {
					this.requestedSelections = event.data.selections;
				} else {
					this.requestedSelections = [];
				}
				break;

			case 'STOPPED_REQUEST':
				break;

			default:
				console.debug(`${event.data.messageName} is not handled`);
		}
	}

	sendBlueBubble(message: string) {
		this.sendMessage('showMessageBubble', { message: message });
	}

	requestSelection(entityTypeSpecifier: SelectionType[], requiredSelectionCount?: number) {
		this.sendMessage('requestSelection', {
			entityTypeSpecifier: entityTypeSpecifier,
			messageId: this.requestSelectionId.toString(),
			requiredSelectionCount: requiredSelectionCount ? requiredSelectionCount : 0
		});
		this.requestSelectionId++;
	}

	stopRequest() {
		this.sendMessage('stopRequest');
	}

	onRequestCompletion(fn: (selections: Selection[]) => void): () => void {
		this.onRequestCompletionCallbacks.push(fn);
		return () => {
			this.onRequestCompletionCallbacks = this.onRequestCompletionCallbacks.filter(
				(cb) => cb !== fn
			);
		};
	}
}
