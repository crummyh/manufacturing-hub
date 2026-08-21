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
