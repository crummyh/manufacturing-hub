<script lang="ts" generics="TData extends RowData">
	import { createTable, FlexRender, type ColumnDef, type RowData } from '@tanstack/svelte-table';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	import { features, type DataTableFeatures } from './data-table-features.js';

	type DataTableProps<TData extends RowData> = {
		columns: ColumnDef<DataTableFeatures, TData>[];
		data: TData[];
		states: {
			id: string;
			name: string;
		}[];
	};

	let { data, columns, states }: DataTableProps<TData> = $props();

	const table = createTable({
		features,
		get data() {
			return data;
		},
		columns,
		meta: {
			get states() {
				return states;
			}
		}
	});
</script>

<div>
	<div class="flex items-center py-4">
		<Input
			placeholder="Filter name..."
			value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
			onchange={(e) => {
				table.getColumn('name')?.setFilterValue(e.currentTarget.value);
			}}
			oninput={(e) => {
				table.getColumn('name')?.setFilterValue(e.currentTarget.value);
			}}
			class="max-w-sm"
		/>
	</div>
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender {header} />
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getAllCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender {cell} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 py-4">
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.previousPage()}
			disabled={!table.getCanPreviousPage()}
		>
			Previous
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.nextPage()}
			disabled={!table.getCanNextPage()}
		>
			Next
		</Button>
	</div>
</div>
