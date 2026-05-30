import { SvelteURLSearchParams } from 'svelte/reactivity';

export interface OnshapeIds {
	documentId: string;
	workspaceId: string;
	elementId: string;
	companyId: string;
}

export class OnshapeAppClient {
	onshapeIds: OnshapeIds;

	constructor(urlParams: URLSearchParams) {
		this.onshapeIds = $state(OnshapeAppClient.getOnshapeIdsFromUrl(urlParams));
	}

	sendMessage(messageName: string, data?: { [key: string]: unknown }): void {
		window.parent.postMessage(
			{
				...this.onshapeIds,
				messageName: messageName,
				...data
			},
			`https://${this.onshapeIds.companyId}.onshape.com`
		);
	}

	checkPostMessage(e: MessageEvent): boolean {
		if (this.getServer() === e.origin) {
			if (e.data && e.data.messageName) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	getServer(): string {
		const params = new SvelteURLSearchParams(window.location.search);

		const serverRaw = params.get('server');

		if (!serverRaw) {
			throw new Error('Missing server URL');
		}

		const server = decodeURIComponent(serverRaw);
		return server;
	}

	private static getOnshapeIdsFromUrl(params: URLSearchParams): OnshapeIds {
		const documentId = params.get('documentId');
		const workspaceId = params.get('workspaceId');
		const elementId = params.get('elementId');
		const companyId = params.get('companyId');

		if (documentId && workspaceId && elementId && companyId) {
			return { documentId, workspaceId, elementId, companyId };
		}

		throw new Error(
			'Missing Onshape IDs in URL. Provide documentId, workspaceId, and elementId as query parameters or use an Onshape document URL.'
		);
	}
}

export enum SelectionType {
	Vertex = 'VERTEX',
	Edge = 'EDGE',
	Face = 'FACE',
	Body = 'BODY',
	DegenerateEdge = 'DEGENERATE_EDGE',
	Unknown = 'UNKNOWN'
}
