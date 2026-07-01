import { sqidInput, sqidOutput } from '$lib/sqid';
import { user } from './auth.schema';
import { relations } from 'drizzle-orm';
import { pgTable, integer, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';

export * from './auth.schema';

/*
 * Each table gets a few sections:
 * 1. The actual Drizzle schema
 * 2. A set of relations
 * 3. A inferred Zod schema for selection, insertion, and updating
 */

// Parts

export const part = pgTable('parts', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('name').notNull(),
	quantity: integer('quantity').notNull(),
	archived: boolean('archived').notNull().default(false),
	assigneeId: text('assignee_id').references(() => user.id),
	projectId: integer('project_id').references(() => project.id),
	stateId: integer('state_id').references(() => state.id)
});

export const partRelations = relations(part, ({ one, many }) => ({
	assignee: one(user, {
		fields: [part.assigneeId],
		references: [user.id]
	}),
	project: one(project, {
		fields: [part.projectId],
		references: [project.id]
	}),
	state: one(state, {
		fields: [part.stateId],
		references: [state.id]
	}),
	partSteps: many(partStep)
}));

export const partSelectSchema = createSelectSchema(part, {
	id: sqidOutput,
	name: (schema) => schema.max(128).min(1),
	quantity: (schema) => schema.max(4786).min(0)
});

export const partInsertSchema = createInsertSchema(part, {
	name: (schema) => schema.max(128).min(1),
	quantity: (schema) => schema.max(4786).min(0),
	assigneeId: sqidInput.optional(),
	projectId: sqidInput.optional()
});

export const partUpdateSchema = createUpdateSchema(part, {
	name: (schema) => schema.max(128).min(1),
	quantity: (schema) => schema.max(4786).min(0),
	assigneeId: sqidInput.optional(),
	projectId: sqidInput.optional()
});

// Projects

export const project = pgTable('projects', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('name').notNull()
});

export const projectRelations = relations(project, ({ many }) => ({
	parts: many(part)
}));

export const projectSelectSchema = createSelectSchema(project, {
	id: sqidOutput,
	name: (schema) => schema.max(128).min(1)
});

export const projectInsertSchema = createInsertSchema(project, {
	name: (schema) => schema.max(128).min(1)
});

export const projectUpdateSchema = createUpdateSchema(project, {
	name: (schema) => schema.max(128).min(1)
});

// States

export const state = pgTable('states', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('name').notNull()
});

export const stateRelations = relations(state, ({ many }) => ({
	parts: many(part)
}));

export const stateSelectSchema = createSelectSchema(state, {
	id: sqidOutput,
	name: (schema) => schema.max(128).min(1)
});

export const stateInsertSchema = createInsertSchema(state, {
	name: (schema) => schema.max(128).min(1)
});

export const stateUpdateSchema = createUpdateSchema(state, {
	name: (schema) => schema.max(128).min(1)
});

// Steps

export const step = pgTable('steps', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('name').notNull()
});

export const stepRelations = relations(step, ({ many }) => ({
	partSteps: many(partStep),
	templateSteps: many(templateStep)
}));

export const stepSelectSchema = createSelectSchema(step, {
	id: sqidOutput,
	name: (schema) => schema.max(128).min(1)
});

export const stepInsertSchema = createInsertSchema(step, {
	name: (schema) => schema.max(128).min(1)
});

export const stepUpdateSchema = createUpdateSchema(step, {
	name: (schema) => schema.max(128).min(1)
});

// Part Steps

export const partStep = pgTable('part_steps', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	partId: integer('part_id')
		.notNull()
		.references(() => part.id),
	stepId: integer('step_id')
		.notNull()
		.references(() => step.id),
	order: text('order').$default(() => 'todo'),
	completed: boolean('completed').notNull().default(false),
	completedBy: text('completed_by').references(() => user.id),
	completedAt: timestamp('completed_at', { withTimezone: true })
});

export const partStepRelations = relations(partStep, ({ one }) => ({
	part: one(part, {
		fields: [partStep.partId],
		references: [part.id]
	}),
	step: one(step, {
		fields: [partStep.stepId],
		references: [step.id]
	})
}));

export const partStepSelectSchema = createSelectSchema(partStep, {
	id: sqidOutput,
	partId: sqidOutput,
	stepId: sqidOutput,
	order: (schema) => schema.max(256).min(0)
});

export const partStepInsertSchema = createInsertSchema(partStep, {
	partId: sqidInput,
	stepId: sqidInput,
	order: (schema) => schema.max(256).min(0),
	completedAt: (schema) => schema.max(new Date())
});

export const partStepUpdateSchema = createUpdateSchema(partStep, {
	partId: sqidInput.optional(),
	stepId: sqidInput.optional(),
	order: (schema) => schema.max(256).min(0),
	completedAt: (schema) => schema.max(new Date())
});

// Templates

export const template = pgTable('templates', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('name').notNull()
});

export const templateRelations = relations(template, ({ many }) => ({
	templateSteps: many(templateStep)
}));

export const templateSelectSchema = createSelectSchema(template, {
	id: sqidOutput,
	name: (schema) => schema.max(128).min(1)
});

export const templateInsertSchema = createInsertSchema(template, {
	name: (schema) => schema.max(128).min(1)
});

export const templateUpdateSchema = createUpdateSchema(template, {
	name: (schema) => schema.max(128).min(1)
});

// Template Steps

export const templateStep = pgTable('template_steps', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	templateId: integer('template_id')
		.notNull()
		.references(() => template.id),
	stepId: integer('step_id')
		.notNull()
		.references(() => step.id),
	order: text('order').$default(() => 'todo'),
	optional: boolean('completed').notNull().default(false)
});

export const templateStepSelectSchema = createSelectSchema(templateStep, {
	id: sqidOutput,
	templateId: sqidOutput,
	stepId: sqidOutput,
	order: (schema) => schema.max(256).min(0)
});

export const templateStepRelations = relations(templateStep, ({ one }) => ({
	template: one(template, {
		fields: [templateStep.templateId],
		references: [template.id]
	}),
	step: one(step, {
		fields: [templateStep.stepId],
		references: [step.id]
	})
}));

export const templateStepInsertSchema = createInsertSchema(templateStep, {
	templateId: sqidInput,
	stepId: sqidInput,
	order: (schema) => schema.max(256).min(0)
});

export const templateStepUpdateSchema = createUpdateSchema(templateStep, {
	templateId: sqidInput.optional(),
	stepId: sqidInput.optional(),
	order: (schema) => schema.max(256).min(0)
});
