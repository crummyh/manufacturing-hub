import type { ColumnDef } from '@tanstack/table-core';

type PartData = {
	id: string;
	name: string;
	quantity: number;
	critical: boolean;
	archived: boolean;
	assigneeId: string | null;
	projectId?: string | null | undefined;
	stateId?: string | null | undefined;
	project?:
		| {
				id: string;
				name: string;
		  }
		| null
		| undefined;
	state?:
		| {
				id: string;
				name: string;
				order: string;
		  }
		| null
		| undefined;
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
};

export const columns: ColumnDef<PartData>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'quantity',
		header: 'Quantity'
	},
	{
		accessorKey: 'critical',
		header: 'Critical'
	},
	{
		accessorKey: 'state',
		header: 'State'
	},
	{
		accessorKey: 'archived',
		header: 'Archived'
	},
	{
		accessorKey: 'project',
		header: 'Project'
	},
	{
		accessorKey: 'assignee',
		header: 'Assignee'
	}
];
