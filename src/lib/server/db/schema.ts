import { genDefaultNanoid } from '$lib/nanoid';
import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, type AnyPgColumn } from 'drizzle-orm/pg-core';

import { user } from './auth.schema';

export * from './auth.schema';

// Parts

export const part = pgTable('parts', {
	id: text('id').primaryKey().$defaultFn(genDefaultNanoid),
	name: text('name').notNull(),
	quantity: integer('quantity').notNull(),
	critical: boolean('critical').notNull().default(false),
	archived: boolean('archived').notNull().default(false),
	assigneeId: text('assignee_id').references(() => user.id),
	projectId: text('project_id').references(() => project.id),
	stateId: text('state_id').references(() => state.id),
	currentStepId: text('current_step_id').references(() => partStep.id)
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
	currentStep: one(partStep, {
		fields: [part.currentStepId],
		references: [partStep.id]
	}),
	partSteps: many(partStep)
}));

// Projects

export const project = pgTable('projects', {
	id: text('id').primaryKey().$defaultFn(genDefaultNanoid),
	name: text('name').notNull()
});

export const projectRelations = relations(project, ({ many }) => ({
	parts: many(part)
}));

// States

export const state = pgTable('states', {
	id: text('id').primaryKey().$defaultFn(genDefaultNanoid),
	name: text('name').notNull(),
	order: text('order').notNull()
});

export const stateRelations = relations(state, ({ many }) => ({
	parts: many(part)
}));

// Steps

export const step = pgTable('steps', {
	id: text('id').primaryKey().$defaultFn(genDefaultNanoid),
	name: text('name').notNull()
});

export const stepRelations = relations(step, ({ many }) => ({
	partSteps: many(partStep),
	templateSteps: many(templateStep)
}));

// Part Steps

export const partStep = pgTable('part_steps', {
	id: text('id').primaryKey().$defaultFn(genDefaultNanoid),
	partId: text('part_id')
		.notNull()
		.references((): AnyPgColumn => part.id),
	stepId: text('step_id')
		.notNull()
		.references(() => step.id),
	order: text('order').notNull(),
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

// Templates

export const template = pgTable('templates', {
	id: text('id').primaryKey().$defaultFn(genDefaultNanoid),
	name: text('name').notNull()
});

export const templateRelations = relations(template, ({ many }) => ({
	templateSteps: many(templateStep)
}));

// Template Steps

export const templateStep = pgTable('template_steps', {
	id: text('id').primaryKey().$defaultFn(genDefaultNanoid),
	templateId: text('template_id')
		.notNull()
		.references(() => template.id),
	stepId: text('step_id')
		.notNull()
		.references(() => step.id),
	order: text('order').notNull(),
	optional: boolean('completed').notNull().default(false)
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
