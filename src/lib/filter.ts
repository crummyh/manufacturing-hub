import { resolve } from '$app/paths';
import { sqidInput } from './sqid';
import z, { string } from 'zod';

// The order matters here because it defines the standard for programmatically created filters
const OVERVIEW_FILTERS = ['project', 'assignee'] as const;
type OverviewFilterKey = (typeof OVERVIEW_FILTERS)[number];

/*
 * Constructs an /overview URL with the given filters in the correct order
 */
export function buildOverviewUrl(filters: Partial<Record<OverviewFilterKey, string>>) {
	const segments = OVERVIEW_FILTERS.filter((key) => filters[key]).flatMap((key) => [
		key,
		encodeURIComponent(filters[key]!)
	]);

	return segments.length
		? resolve('/(authed)/(app)/overview/[...filters]', { filters: segments.join('/') })
		: resolve('/(authed)/(app)/overview');
}

/*
 * Parses the filter param and returns the actual filter values
 */
export function parseOverviewFilters(raw: string): Partial<Record<OverviewFilterKey, string>> {
	const segments = raw.split('/').filter(Boolean);

	if (segments.length % 2 !== 0) {
		throw Error('Malformed filter path - each key needs a value');
	}

	const filters: Partial<Record<OverviewFilterKey, string>> = {};

	for (let i = 0; i < segments.length; i += 2) {
		const key = decodeURIComponent(segments[i]);
		const value = decodeURIComponent(segments[i + 1]);

		if (!OVERVIEW_FILTERS.includes(key as OverviewFilterKey)) {
			throw Error(`Unknown filter: ${key}`);
		}

		filters[key as OverviewFilterKey] = value;
	}

	return filters;
}

export const overviewFilterSchema = z.object({
	project: sqidInput.optional(),
	assignee: string().optional()
});
