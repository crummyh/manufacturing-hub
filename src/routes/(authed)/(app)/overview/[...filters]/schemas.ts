import { partInsertSchemaClient } from '$lib/schemas/client/part';
import { sqidInputClient } from '$lib/sqid';
import z from 'zod';

export const newPartSchemaClient = partInsertSchemaClient.extend({
	steps: sqidInputClient.array()
});

export type NewPartClient = z.infer<typeof newPartSchemaClient>;
export type NewPartSchemaClient = typeof newPartSchemaClient;

export interface KanbanPart {
	id: string;
	name: string;
	quantity: number;
	critical: boolean;
	archived: boolean;
	stateId: string;
	assigneeId?: string | null | undefined;
	projectId?: string | null | undefined;
	assignee?:
		| {
				id: string;
				name: string;
				email: string;
				emailVerified: boolean;
				image: string | null;
				createdAt: Date;
				updatedAt: Date;
		  }
		| null
		| undefined;
	project?:
		| {
				id: string;
				name: string;
		  }
		| null
		| undefined;
}

export type KanbanState = {
	id: string;
	name: string;
	parts: KanbanPart[];
};

export type ProjectsSelect = {
	id: string;
	name: string;
}[];

export type Templates = {
	id: string;
	name: string;
	steps: {
		id: string;
		name: string;
	}[];
}[];

export type Steps = {
	id: string;
	name: string;
}[];
