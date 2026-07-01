import { requireUser } from './auth';
import { isRedirect, type Redirect } from '@sveltejs/kit';
import { describe, expect, test } from 'vitest';

describe('require user', () => {
	test('redirects with no user', () => {
		try {
			requireUser({});
			expect.fail('expected requireUser to throw a redirect');
		} catch (err) {
			expect(isRedirect(err)).toBe(true);
			expect((err as Redirect).status).toBe(303);
		}
	});

	test('adds a return parameter', () => {
		try {
			requireUser({}, 'my/address');
			expect.fail('expected requireUser to throw a redirect');
		} catch (err) {
			const redirect = err as Redirect;
			expect(isRedirect(err)).toBe(true);
			expect(redirect.location.includes('my%2Faddress')).toBe(true);
		}
	});
});
