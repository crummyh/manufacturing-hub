import { user } from './auth.schema';
import { relations } from 'drizzle-orm';
import { pgTable, serial, integer, text, timestamp, smallint, boolean } from 'drizzle-orm/pg-core';

export * from './auth.schema';

export const part = pgTable('part', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	quantity: smallint('quantity').notNull(),
	critical: boolean('critical').default(false).notNull(),
	thicknessId: integer('thickness_id').references(() => thickness.id, { onDelete: 'set null' }),
	materialId: integer('material_id').references(() => material.id, { onDelete: 'set null' }),
	finishId: integer('finish_id').references(() => finish.id, { onDelete: 'set null' }),
	projectId: integer('project_id').references(() => project.id, { onDelete: 'set null' }),
	typeId: integer('type_id').references(() => type.id, { onDelete: 'set null' }),
	stateId: integer('state_id').references(() => state.id, { onDelete: 'set null' }),
	assignedToId: text('assigned_to_id').references(() => user.id, { onDelete: 'restrict' }),
	order: text('order').notNull(),
	createdAt: timestamp('created_at', { precision: 0 }).defaultNow()
});

export const project = pgTable('project', {
	id: serial('id').primaryKey(),
	name: text('name').notNull()
});

export const type = pgTable('type', {
	id: serial('id').primaryKey(),
	name: text('name').notNull()
});

export const state = pgTable('state', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	order: text('order').notNull()
});

export const thickness = pgTable('thickness', {
	id: serial('id').primaryKey(),
	name: text('name').notNull()
});

export const material = pgTable('material', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	onshapeName: text('onshape_name')
});

export const finish = pgTable('finish', {
	id: serial('id').primaryKey(),
	name: text('name').notNull()
});

export const stateRelations = relations(state, ({ many }) => ({
	parts: many(part)
}));

export const partRelations = relations(part, ({ one }) => ({
	thickness: one(thickness, { fields: [part.thicknessId], references: [thickness.id] }),
	material: one(material, { fields: [part.materialId], references: [material.id] }),
	finish: one(finish, { fields: [part.finishId], references: [finish.id] }),
	project: one(project, { fields: [part.projectId], references: [project.id] }),
	type: one(type, { fields: [part.typeId], references: [type.id] }),
	state: one(state, { fields: [part.stateId], references: [state.id] }),
	assignedTo: one(user, { fields: [part.assignedToId], references: [user.id] })
}));
