import { db } from '..';
import { finish, material, part, project, state, thickness } from '../schema';
import { asc } from 'drizzle-orm';

type KanbanQueryResult = Awaited<ReturnType<typeof getKanbanColumns>>;

export type KanbanColumn = KanbanQueryResult[number];
export type KanbanPart = KanbanColumn['parts'][number];

export async function getKanbanColumns() {
	return await db.query.state.findMany({
		orderBy: asc(state.order),
		with: {
			parts: {
				orderBy: asc(part.order),
				with: {
					thickness: true,
					material: true,
					finish: true,
					project: true,
					type: true,
					assignedTo: true,
					state: true
				}
			}
		}
	});
}

export type Thicknesses = Awaited<ReturnType<typeof getThicknesses>>;
export type Materials = Awaited<ReturnType<typeof getMaterials>>;
export type Finishes = Awaited<ReturnType<typeof getFinishes>>;

export async function getThicknesses() {
	return await db.select().from(thickness);
}

export async function getMaterials() {
	return await db.select().from(material);
}

export async function getFinishes() {
	return await db.select().from(finish);
}

export async function getProjects() {
	return await db.select().from(project);
}
