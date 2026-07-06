import { sqidInput, sqidOutput } from '$lib/sqid';
import { part, project, state, step, partStep, template, templateStep } from './schema';
import { createSelectSchema } from 'drizzle-zod';
import { createInsertSchema } from 'drizzle-zod';
import { createUpdateSchema } from 'drizzle-zod';
import type z from 'zod';

// Parts

export const partSelectSchema = createSelectSchema(part, {
	id: sqidOutput,
	name: (schema) => schema.max(128).min(1),
	quantity: (schema) => schema.max(4786).min(0),
	stateId: sqidOutput.optional().nullable(),
	projectId: sqidOutput.optional().nullable()
});

export const partInsertSchema = createInsertSchema(part, {
	name: (schema) => schema.max(128).min(1),
	quantity: (schema) => schema.max(4786).min(0),
	stateId: sqidInput.optional().nullable(),
	projectId: sqidInput.optional().nullable()
});

export const partUpdateSchema = createUpdateSchema(part, {
	name: (schema) => schema.max(128).min(1),
	quantity: (schema) => schema.max(4786).min(0),
	stateId: sqidInput.optional().nullable(),
	projectId: sqidInput.optional().nullable()
});

export type PartSelect = z.infer<typeof partSelectSchema>;
export type PartInsert = z.infer<typeof partInsertSchema>;
export type PartUpdate = z.infer<typeof partUpdateSchema>;

export type PartSelectSchema = typeof partSelectSchema;
export type PartInsertSchema = typeof partInsertSchema;
export type PartUpdateSchema = typeof partUpdateSchema;

// Projects

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

export type ProjectSelect = z.infer<typeof projectSelectSchema>;
export type ProjectInsert = z.infer<typeof projectInsertSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

export type ProjectSelectSchema = typeof projectSelectSchema;
export type ProjectInsertSchema = typeof projectInsertSchema;
export type ProjectUpdateSchema = typeof projectUpdateSchema;

// States

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

export type StateSelect = z.infer<typeof stateSelectSchema>;
export type StateInsert = z.infer<typeof stateInsertSchema>;
export type StateUpdate = z.infer<typeof stateUpdateSchema>;

export type StateSelectSchema = typeof stateSelectSchema;
export type StateInsertSchema = typeof stateInsertSchema;
export type StateUpdateSchema = typeof stateUpdateSchema;

// Steps

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

export type StepSelect = z.infer<typeof stepSelectSchema>;
export type StepInsert = z.infer<typeof stepInsertSchema>;
export type StepUpdate = z.infer<typeof stepUpdateSchema>;

export type StepSelectSchema = typeof stepSelectSchema;
export type StepInsertSchema = typeof stepInsertSchema;
export type StepUpdateSchema = typeof stepUpdateSchema;

// Part Steps

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

export type PartStepSelect = z.infer<typeof partStepSelectSchema>;
export type PartStepInsert = z.infer<typeof partStepInsertSchema>;
export type PartStepUpdate = z.infer<typeof partStepUpdateSchema>;

export type PartStepSelectSchema = typeof partStepSelectSchema;
export type PartStepInsertSchema = typeof partStepInsertSchema;
export type PartStepUpdateSchema = typeof partStepUpdateSchema;

// Templates

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

export type TemplateSelect = z.infer<typeof templateSelectSchema>;
export type TemplateInsert = z.infer<typeof templateInsertSchema>;
export type TemplateUpdate = z.infer<typeof templateUpdateSchema>;

export type TemplateSelectSchema = typeof templateSelectSchema;
export type TemplateInsertSchema = typeof templateInsertSchema;
export type TemplateUpdateSchema = typeof templateUpdateSchema;

// Template Steps

export const templateStepSelectSchema = createSelectSchema(templateStep, {
	id: sqidOutput,
	templateId: sqidOutput,
	stepId: sqidOutput,
	order: (schema) => schema.max(256).min(0)
});

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

export type TemplateStepSelect = z.infer<typeof templateStepSelectSchema>;
export type TemplateStepInsert = z.infer<typeof templateStepInsertSchema>;
export type TemplateStepUpdate = z.infer<typeof templateStepUpdateSchema>;

export type TemplateStepSelectSchema = typeof templateStepSelectSchema;
export type TemplateStepInsertSchema = typeof templateStepInsertSchema;
export type TemplateStepUpdateSchema = typeof templateStepUpdateSchema;
