import { userAbbr } from './utils';
import { expect, test } from 'vitest';

test('user abbreviations', () => {
	expect(userAbbr('John Doe')).toBe('JD');
});
