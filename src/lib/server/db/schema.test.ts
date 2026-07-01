import * as schema from './schema';
import { describe, test, expect } from 'vitest';

const {
	part,
	partSelectSchema,
	partInsertSchema,
	partUpdateSchema,
	partRelations,
	project,
	projectSelectSchema,
	projectInsertSchema,
	projectUpdateSchema,
	projectRelations,
	state,
	stateSelectSchema,
	stateInsertSchema,
	stateUpdateSchema,
	stateRelations,
	step,
	stepSelectSchema,
	stepInsertSchema,
	stepUpdateSchema,
	stepRelations,
	partStep,
	partStepSelectSchema,
	partStepInsertSchema,
	partStepUpdateSchema,
	partStepRelations,
	template,
	templateSelectSchema,
	templateInsertSchema,
	templateUpdateSchema,
	templateRelations,
	templateStep,
	templateStepSelectSchema,
	templateStepInsertSchema,
	templateStepUpdateSchema,
	templateStepRelations
} = schema;

/**
 * ---------------------------------------------------------------------------
 * Shared fixtures
 * ---------------------------------------------------------------------------
 */
const validSqidOutput = 'vofA';
const validSqidInput = 4786;

/**
 * ---------------------------------------------------------------------------
 * Parts
 * ---------------------------------------------------------------------------
 */
describe('part schemas', () => {
	describe('partInsertSchema', () => {
		const validInsert = {
			name: 'Widget',
			quantity: 10
		};

		test('accepts a minimal valid payload (optional FKs omitted)', () => {
			expect(partInsertSchema.safeParse(validInsert).success).toBe(true);
		});

		test('accepts optional assigneeId/projectId as sqid strings', () => {
			const result = partInsertSchema.safeParse({
				...validInsert,
				assigneeId: validSqidOutput,
				projectId: validSqidOutput
			});
			expect(result.success).toBe(true);
			if (result.success) {
				// sqidInput mock transforms numeric strings to numbers
				expect(result.data.assigneeId).toBe(validSqidInput);
				expect(result.data.projectId).toBe(validSqidInput);
			}
		});

		test('rejects a non-numeric sqid string for assigneeId', () => {
			const result = partInsertSchema.safeParse({
				...validInsert,
				assigneeId: 'not-a-sqid'
			});
			expect(result.success).toBe(false);
		});

		test('rejects an empty name', () => {
			const result = partInsertSchema.safeParse({ ...validInsert, name: '' });
			expect(result.success).toBe(false);
		});

		test('rejects a name over 128 characters', () => {
			const result = partInsertSchema.safeParse({
				...validInsert,
				name: 'a'.repeat(129)
			});
			expect(result.success).toBe(false);
		});

		test('accepts a name at exactly 128 characters (boundary)', () => {
			const result = partInsertSchema.safeParse({
				...validInsert,
				name: 'a'.repeat(128)
			});
			expect(result.success).toBe(true);
		});

		test('accepts a name at exactly 1 character (boundary)', () => {
			const result = partInsertSchema.safeParse({ ...validInsert, name: 'a' });
			expect(result.success).toBe(true);
		});

		test('rejects quantity below 0', () => {
			const result = partInsertSchema.safeParse({ ...validInsert, quantity: -1 });
			expect(result.success).toBe(false);
		});

		test('rejects quantity above 4786', () => {
			const result = partInsertSchema.safeParse({ ...validInsert, quantity: 4787 });
			expect(result.success).toBe(false);
		});

		test('accepts quantity at boundaries 0 and 4786', () => {
			expect(partInsertSchema.safeParse({ ...validInsert, quantity: 0 }).success).toBe(true);
			expect(partInsertSchema.safeParse({ ...validInsert, quantity: 4786 }).success).toBe(true);
		});

		test('rejects a missing required field (name)', () => {
			const result = partInsertSchema.safeParse({ quantity: 5 });
			expect(result.success).toBe(false);
		});
	});

	describe('partSelectSchema', () => {
		test('transforms a numeric id via sqidOutput', () => {
			const result = partSelectSchema.safeParse({
				id: validSqidInput,
				name: 'Widget',
				quantity: 1,
				archived: false,
				assigneeId: null,
				projectId: null,
				stateId: null
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe(validSqidOutput);
			}
		});

		test('rejects an out-of-range quantity even on select', () => {
			const result = partSelectSchema.safeParse({
				id: validSqidInput,
				name: 'Widget',
				quantity: 99999,
				archived: false,
				assigneeId: null,
				projectId: null,
				stateId: null
			});
			expect(result.success).toBe(false);
		});
	});

	describe('partUpdateSchema', () => {
		test('accepts an empty object (all fields optional on update)', () => {
			expect(partUpdateSchema.safeParse({}).success).toBe(true);
		});

		test('still enforces field-level constraints when a field is provided', () => {
			expect(partUpdateSchema.safeParse({ name: '' }).success).toBe(false);
			expect(partUpdateSchema.safeParse({ quantity: -5 }).success).toBe(false);
			expect(partUpdateSchema.safeParse({ name: 'Renamed Widget' }).success).toBe(true);
		});
	});

	describe('partRelations', () => {
		test('is defined', () => {
			expect(partRelations).toBeDefined();
		});
	});

	test('part table is exported', () => {
		expect(part).toBeDefined();
	});
});

/**
 * ---------------------------------------------------------------------------
 * Projects
 * ---------------------------------------------------------------------------
 */
describe('project schemas', () => {
	test('insert accepts a valid name', () => {
		expect(projectInsertSchema.safeParse({ name: 'Comp Intake' }).success).toBe(true);
	});

	test('insert rejects empty and overlong names', () => {
		expect(projectInsertSchema.safeParse({ name: '' }).success).toBe(false);
		expect(projectInsertSchema.safeParse({ name: 'a'.repeat(129) }).success).toBe(false);
	});

	test('select transforms id via sqidOutput', () => {
		const result = projectSelectSchema.safeParse({ id: validSqidInput, name: 'Comp Intake' });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.id).toBe(validSqidOutput);
	});

	test('update allows partial payloads', () => {
		expect(projectUpdateSchema.safeParse({}).success).toBe(true);
		expect(projectUpdateSchema.safeParse({ name: '' }).success).toBe(false);
	});

	test('table and relations are exported', () => {
		expect(project).toBeDefined();
		expect(projectRelations).toBeDefined();
	});
});

/**
 * ---------------------------------------------------------------------------
 * States
 * ---------------------------------------------------------------------------
 */
describe('state schemas', () => {
	test('insert accepts a valid name and rejects invalid ones', () => {
		expect(stateInsertSchema.safeParse({ name: 'In Progress' }).success).toBe(true);
		expect(stateInsertSchema.safeParse({ name: '' }).success).toBe(false);
		expect(stateInsertSchema.safeParse({ name: 'a'.repeat(129) }).success).toBe(false);
	});

	test('select transforms id via sqidOutput', () => {
		const result = stateSelectSchema.safeParse({ id: validSqidInput, name: 'Done' });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.id).toBe(validSqidOutput);
	});

	test('update allows partial payloads', () => {
		expect(stateUpdateSchema.safeParse({}).success).toBe(true);
	});

	test('table and relations are exported', () => {
		expect(state).toBeDefined();
		expect(stateRelations).toBeDefined();
	});
});

/**
 * ---------------------------------------------------------------------------
 * Steps
 * ---------------------------------------------------------------------------
 */
describe('step schemas', () => {
	test('insert accepts a valid name and rejects invalid ones', () => {
		expect(stepInsertSchema.safeParse({ name: 'Solder' }).success).toBe(true);
		expect(stepInsertSchema.safeParse({ name: '' }).success).toBe(false);
		expect(stepInsertSchema.safeParse({ name: 'a'.repeat(129) }).success).toBe(false);
	});

	test('select transforms id via sqidOutput', () => {
		const result = stepSelectSchema.safeParse({ id: validSqidInput, name: 'Solder' });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.id).toBe(validSqidOutput);
	});

	test('update allows partial payloads', () => {
		expect(stepUpdateSchema.safeParse({}).success).toBe(true);
	});

	test('table and relations are exported', () => {
		expect(step).toBeDefined();
		expect(stepRelations).toBeDefined();
	});
});

/**
 * ---------------------------------------------------------------------------
 * Part Steps
 * ---------------------------------------------------------------------------
 */
describe('partStep schemas', () => {
	const validInsert = {
		partId: validSqidOutput,
		stepId: validSqidOutput
	};

	describe('partStepInsertSchema', () => {
		test('accepts a minimal valid payload', () => {
			expect(partStepInsertSchema.safeParse(validInsert).success).toBe(true);
		});

		test('transforms partId/stepId via sqidInput', () => {
			const result = partStepInsertSchema.safeParse(validInsert);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.partId).toBe(validSqidInput);
				expect(result.data.stepId).toBe(validSqidInput);
			}
		});

		test('rejects missing partId/stepId', () => {
			expect(partStepInsertSchema.safeParse({}).success).toBe(false);
			expect(partStepInsertSchema.safeParse({ partId: validSqidOutput }).success).toBe(false);
		});

		test('rejects a sqid string', () => {
			const result = partStepInsertSchema.safeParse({
				...validInsert,
				partId: '*not* an sqid'
			});
			expect(result.success).toBe(false);
		});

		test('accepts order up to 256 characters and rejects beyond', () => {
			expect(
				partStepInsertSchema.safeParse({ ...validInsert, order: 'a'.repeat(256) }).success
			).toBe(true);
			expect(
				partStepInsertSchema.safeParse({ ...validInsert, order: 'a'.repeat(257) }).success
			).toBe(false);
		});

		test('accepts a completedAt in the past', () => {
			const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
			expect(
				partStepInsertSchema.safeParse({ ...validInsert, completedAt: yesterday }).success
			).toBe(true);
		});

		test('rejects a completedAt in the future', () => {
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
			expect(
				partStepInsertSchema.safeParse({ ...validInsert, completedAt: tomorrow }).success
			).toBe(false);
		});
	});

	describe('partStepSelectSchema', () => {
		test('transforms id/partId/stepId via sqidOutput', () => {
			const result = partStepSelectSchema.safeParse({
				id: validSqidInput,
				partId: validSqidInput,
				stepId: validSqidInput,
				order: 'todo',
				completed: false,
				completedBy: null,
				completedAt: null
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe(validSqidOutput);
				expect(result.data.partId).toBe(validSqidOutput);
				expect(result.data.stepId).toBe(validSqidOutput);
			}
		});
	});

	describe('partStepUpdateSchema', () => {
		test('allows partial payloads', () => {
			expect(partStepUpdateSchema.safeParse({}).success).toBe(true);
		});

		test('still enforces the completedAt-not-in-future rule when provided', () => {
			const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
			expect(partStepUpdateSchema.safeParse({ completedAt: tomorrow }).success).toBe(false);
		});
	});

	test('table and relations are exported', () => {
		expect(partStep).toBeDefined();
		expect(partStepRelations).toBeDefined();
	});
});

/**
 * ---------------------------------------------------------------------------
 * Templates
 * ---------------------------------------------------------------------------
 */
describe('template schemas', () => {
	test('insert accepts a valid name and rejects invalid ones', () => {
		expect(templateInsertSchema.safeParse({ name: 'Standard Build' }).success).toBe(true);
		expect(templateInsertSchema.safeParse({ name: '' }).success).toBe(false);
		expect(templateInsertSchema.safeParse({ name: 'a'.repeat(129) }).success).toBe(false);
	});

	test('select transforms id via sqidOutput', () => {
		const result = templateSelectSchema.safeParse({ id: validSqidInput, name: 'Standard Build' });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.id).toBe(validSqidOutput);
	});

	test('update allows partial payloads', () => {
		expect(templateUpdateSchema.safeParse({}).success).toBe(true);
	});

	test('table and relations are exported', () => {
		expect(template).toBeDefined();
		expect(templateRelations).toBeDefined();
	});
});

/**
 * ---------------------------------------------------------------------------
 * Template Steps
 * ---------------------------------------------------------------------------
 */
describe('templateStep schemas', () => {
	const validInsert = {
		templateId: validSqidOutput,
		stepId: validSqidOutput
	};

	describe('templateStepInsertSchema', () => {
		test('accepts a minimal valid payload', () => {
			expect(templateStepInsertSchema.safeParse(validInsert).success).toBe(true);
		});

		test('transforms templateId/stepId via sqidInput', () => {
			const result = templateStepInsertSchema.safeParse(validInsert);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.templateId).toBe(validSqidInput);
				expect(result.data.stepId).toBe(validSqidInput);
			}
		});

		test('rejects missing templateId/stepId', () => {
			expect(templateStepInsertSchema.safeParse({}).success).toBe(false);
		});

		test('accepts order up to 256 characters and rejects beyond', () => {
			expect(
				templateStepInsertSchema.safeParse({ ...validInsert, order: 'a'.repeat(256) }).success
			).toBe(true);
			expect(
				templateStepInsertSchema.safeParse({ ...validInsert, order: 'a'.repeat(257) }).success
			).toBe(false);
		});

		test('accepts an optional boolean "optional" flag', () => {
			expect(templateStepInsertSchema.safeParse({ ...validInsert, optional: true }).success).toBe(
				true
			);
		});
	});

	describe('templateStepSelectSchema', () => {
		test('transforms id/templateId/stepId via sqidOutput', () => {
			const result = templateStepSelectSchema.safeParse({
				id: validSqidInput,
				templateId: validSqidInput,
				stepId: validSqidInput,
				order: 'todo',
				optional: false
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe(validSqidOutput);
				expect(result.data.templateId).toBe(validSqidOutput);
				expect(result.data.stepId).toBe(validSqidOutput);
			}
		});
	});

	describe('templateStepUpdateSchema', () => {
		test('allows partial payloads', () => {
			expect(templateStepUpdateSchema.safeParse({}).success).toBe(true);
		});

		test('rejects an order over 256 characters when provided', () => {
			expect(templateStepUpdateSchema.safeParse({ order: 'a'.repeat(257) }).success).toBe(false);
		});
	});

	test('table and relations are exported', () => {
		expect(templateStep).toBeDefined();
		expect(templateStepRelations).toBeDefined();
	});
});
