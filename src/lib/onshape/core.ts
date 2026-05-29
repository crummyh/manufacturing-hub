export interface OnshapeIds {
	documentId: string;
	workspaceId: string;
	elementId: string;
	companyId: string;
}

export function getOnshapeIdsFromUrl(params: URLSearchParams): OnshapeIds {
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

function getServer(): string {
	const params = new URLSearchParams(window.location.search);

	const serverRaw = params.get('server');

	if (!serverRaw) {
		throw new Error('Missing server URL');
	}

	const server = decodeURIComponent(serverRaw);
	return server;
}

export function sendMessage(
	messageName: string,
	ids: OnshapeIds,
	data?: { [key: string]: unknown }
): void {
	window.parent.postMessage(
		{
			...ids,
			messageName: messageName,
			...data
		},
		`https://${ids.companyId}.onshape.com`
	);
}

export function checkPostMessage(e: MessageEvent): boolean {
	if (getServer() === e.origin) {
		if (e.data && e.data.messageName) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
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
