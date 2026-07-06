import { getErrorMessage, userAbbr } from './utils';
import { describe, expect, test } from 'vitest';

test('user abbreviations', () => {
	expect(userAbbr('John Doe')).toBe('JD');
});

describe('get error message', () => {
	test('gets the message of an error', () => {
		expect(getErrorMessage(new Error('message'))).toBe('message');
	});

	test('gets a string', () => {
		expect(getErrorMessage('message')).toBe('message');
	});

	test('returns unknown', () => {
		expect(getErrorMessage(123)).toContain('unknown');
	});
});
