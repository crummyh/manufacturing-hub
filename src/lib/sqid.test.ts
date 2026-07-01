import { fromSqid, sqidInput, sqidOutput, toSqid } from './sqid';
import { expect, test } from 'vitest';
import z from 'zod';

test('encode an sqid', () => {
	expect(toSqid(4786)).toBe('vofA');
});

test('decode an sqid', () => {
	expect(fromSqid('vofA')).toBe(4786);
});

test('decode a bad sqid', () => {
	expect(() => fromSqid('this is *not* an sqid')).toThrow(Error);
});

test('transform ids', () => {
	const inputSchema = z.object({
		id: sqidInput
	});

	const validatedInput = inputSchema.parse({ id: 'Viz' });
	expect(validatedInput.id).toBe(1678);

	const outputSchema = z.object({
		id: sqidOutput
	});

	const validatedOutput = outputSchema.parse({ id: 254 });
	expect(validatedOutput.id).toBe('OCo');
});
