import { user } from './auth.schema';
import { relations } from 'drizzle-orm';
import { pgTable, integer, text, timestamp, boolean, type AnyPgColumn } from 'drizzle-orm/pg-core';

export * from './auth.schema';

// Parts

export const part = pgTable('parts', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('name').notNull(),
	quantity: integer('quantity').notNull(),
	critical: boolean('critical').notNull().default(false),
	archived: boolean('archived').notNull().default(false),
	assigneeId: text('assignee_id').references(() => user.id),
	projectId: integer('project_id').references(() => project.id),
  stateId: integer('state_id').references(() => state.id),
  currentStepId: integer('current_step_id').references(() => partStep.id)
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
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('name').notNull()
});

export const projectRelations = relations(project, ({ many }) => ({
	parts: many(part)
}));

// States

export const state = pgTable('states', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('name').notNull(),
	order: text('order').notNull()
});

export const stateRelations = relations(state, ({ many }) => ({
	parts: many(part)
}));

// Steps

export const step = pgTable('steps', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('name').notNull()
});

export const stepRelations = relations(step, ({ many }) => ({
	partSteps: many(partStep),
	templateSteps: many(templateStep)
}));

// Part Steps

export const partStep = pgTable('part_steps', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	partId: integer('part_id')
		.notNull()
		.references((): AnyPgColumn => part.id),
	stepId: integer('step_id')
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
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('name').notNull()
});

export const templateRelations = relations(template, ({ many }) => ({
	templateSteps: many(templateStep)
}));

// Template Steps

export const templateStep = pgTable('template_steps', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	templateId: integer('template_id')
		.notNull()
		.references(() => template.id),
	stepId: integer('step_id')
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
