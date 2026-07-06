import { buildOverviewUrl, parseOverviewFilters } from './filter';
import { describe, expect, test } from 'vitest';

describe('build overview url', () => {
	test('returns base with not filters', () => {
		expect(buildOverviewUrl({})).toBe('/overview');
	});

	test('orders filters', () => {
		expect(buildOverviewUrl({ status: 'abc', assignee: 'def', project: 'ghi' })).toBe(
			'/overview/project/ghi/assignee/def/status/abc'
		);
	});
});

describe('parse filters', () => {
	test('decodes valid filters', () => {
		expect(parseOverviewFilters('project/ghi/assignee/def/status/abc')).toEqual({
			status: 'abc',
			assignee: 'def',
			project: 'ghi'
		});
	});

	test('decodes partial filters', () => {
		expect(parseOverviewFilters('project/ghi/status/abc')).toEqual({
			status: 'abc',
			project: 'ghi'
		});
	});

	test('fails on unknown filters', () => {
		expect(() => parseOverviewFilters('project/ghi/imnotafilter/somthing')).toThrow(Error);
	});

	test('fails on partial filters', () => {
		expect(() => parseOverviewFilters('project/ghi/assignee')).toThrow(Error);
	});
});
