import { describe, expect, expectTypeOf, test } from 'vitest';
import { ZodError } from 'zod';

import { defaultNanoid, ID_LENGTH, zNanoid } from './nanoid';

describe('nanoid', () => {
	test('returns a string of the correct length', () => {
		const id = defaultNanoid();
		expectTypeOf(id).toBeString();
		expect(id).toHaveLength(ID_LENGTH);
	});

	describe('nanoid schema', () => {
		test('accepts good primary keys', () => {
			const testId = defaultNanoid();
			const result = zNanoid.parse(testId);
			expectTypeOf(result).toBeString();
			expect(result).toHaveLength(ID_LENGTH);
		});

		test('rejects bad primary keys', () => {
			expect(() => zNanoid.parse('thisIsTechnicallyANanoidButItIsWayTooLong')).toThrow(ZodError);
			expect(() => zNanoid.parse('short')).toThrow(ZodError);
			expect(() => zNanoid.parse('&(*@^$@#)(&{}|:,./[!<')).toThrow(ZodError);
		});
	});
});
