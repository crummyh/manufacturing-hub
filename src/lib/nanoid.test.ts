import { describe, expect, expectTypeOf, test } from 'vitest';

import { defaultNanoid, ID_LENGTH } from './nanoid';

describe('nanoid', () => {
	test('returns a string of the correct length', () => {
		const id = defaultNanoid();
		expectTypeOf(id).toBeString();
		expect(id).toHaveLength(ID_LENGTH);
	});
});
