import { PUBLIC_ONSHAPE_ENTERPRISE } from '$env/static/public';

export interface OnshapeIds {
	documentId: string;
	workspaceId: string;
	elementId: string;
}

export function getOnshapeIdsFromUrl(currentURL: string): OnshapeIds {
	const url = new URL(currentURL);
	const params = url.searchParams;

	const documentId = params.get('documentId');
	const workspaceId = params.get('workspaceId');
	const elementId = params.get('elementId');

	if (documentId && workspaceId && elementId) {
		return { documentId, workspaceId, elementId };
	}

	const pathMatch = url.pathname.match(/\/documents\/([^/]+)\/(?:w|v|m)\/([^/]+)\/e\/([^/]+)/);

	if (pathMatch) {
		return {
			documentId: pathMatch[1],
			workspaceId: pathMatch[2],
			elementId: pathMatch[3]
		};
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
		`https://${PUBLIC_ONSHAPE_ENTERPRISE}.onshape.com`
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
