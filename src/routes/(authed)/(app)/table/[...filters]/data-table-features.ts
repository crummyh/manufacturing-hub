import { compareItems, rankItem, type RankingInfo } from '@tanstack/match-sorter-utils';
import {
	columnFilteringFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	metaHelper,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_text,
	tableFeatures,
	type FilterFn,
	type RowData,
	type SortFn,
	type TableFeatures
} from '@tanstack/svelte-table';

// Fuzzy filtering setup
interface FuzzyFilterMeta {
	itemRank?: RankingInfo;
}

type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta };

const fuzzyFilter: FilterFn<FuzzyFeatures, RowData> = (row, columnId, value, addMeta) => {
	// Rank the item
	const itemRank = rankItem(row.getValue(columnId), value);

	// Store the itemRank info
	addMeta?.({ itemRank });

	// Return if the item should be filtered in/out
	return itemRank.passed;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fuzzySort: SortFn<FuzzyFeatures, any> = (rowA, rowB, columnId) => {
	let dir = 0;
	if (rowA.columnFiltersMeta[columnId]) {
		dir = compareItems(
			rowA.columnFiltersMeta[columnId].itemRank as RankingInfo,
			rowB.columnFiltersMeta[columnId].itemRank as RankingInfo
		);
	}
	return dir === 0 ? sortFn_alphanumeric(rowA, rowB, columnId) : dir;
};

// Defines features needed for our table
export const features = tableFeatures({
	columnFilteringFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	filterFns: { fuzzy: fuzzyFilter },
	sortFns: { alphanumeric: sortFn_alphanumeric, fuzzy: fuzzySort },
	filterMeta: metaHelper<FuzzyFilterMeta>()
});

export type DataTableFeatures = typeof features;

// Define types for meta
declare module '@tanstack/svelte-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
		states: { id: number; name: string }[];
	}
}
