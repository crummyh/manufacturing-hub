import { createColumnHelper, renderComponent, renderSnippet } from '@tanstack/svelte-table';

import DataTableActions from './data-table-actions.svelte';
import DataTableAssignee from './data-table-assignee.svelte';
import DataTableCheckbox from './data-table-checkbox.svelte';
import { type DataTableFeatures } from './data-table-features';
import DataTableSortButton from './data-table-sort-button.svelte';
import DataTableProject from './data-table-project.svelte';
import DataTableState from './data-table-state.svelte';
import { ArrowDown01Icon, ArrowDownZAIcon, ArrowUp10Icon, ArrowUpAZIcon } from '@lucide/svelte';
import { createRawSnippet } from 'svelte';
import { resolve } from '$app/paths';

type PartData = {
	id: string;
	name: string;
	quantity: number;
	critical: boolean;
	archived: boolean;
	assignee: {
		id: string;
		name: string;
		image: string | null;
	} | null;
	project: {
		id: string;
		name: string;
	} | null;
	state: {
		id: string;
		name: string;
	} | null;
	currentStep: {
		step: {
			name: string;
		};
	} | null;
};

const columnHelper = createColumnHelper<DataTableFeatures, PartData>();

export const columns = columnHelper.columns([
	columnHelper.display({
    id: 'select',
		header: ({ table }) =>
			renderComponent(DataTableCheckbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value: boolean) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(DataTableCheckbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			}),
		enableSorting: false
	}),

	columnHelper.accessor('name', {
		header: ({ column }) =>
      renderComponent(DataTableSortButton, {
        label: "Name",
        onclick: column.getToggleSortingHandler(),
        sortDir: column.getIsSorted(),
        AscIcon: ArrowUpAZIcon,
        DescIcon: ArrowDownZAIcon
      }),
      cell: ({ row }) => {
            const nameLinkSnippet = createRawSnippet<[{ name: string, id: string }]>(
              (getProps) => {
                const { name, id } = getProps();
                return {
                  render: () =>
                    `<a href="${resolve("/part/[partId]", { partId: id })}" class="hover:underline">${name}</div>`,
                };
              }
            );

        return renderSnippet(nameLinkSnippet, {
          name: row.original.name,
          id: row.original.id
        });
      },
        filterFn: 'fuzzy'
	}),

	columnHelper.accessor('quantity', {
  	header: ({ column }) =>
        renderComponent(DataTableSortButton, {
          label: "Quantity",
          onclick: column.getToggleSortingHandler(),
          sortDir: column.getIsSorted(),
          AscIcon: ArrowUp10Icon,
          DescIcon: ArrowDown01Icon
        }),
  }),

	columnHelper.accessor('critical', {
		header: 'Critical',
		cell: ({ row }) => {
			return renderComponent(DataTableCheckbox, { checked: row.original.critical, readonly: true });
		}
	}),

	columnHelper.accessor((row) => row.project?.name ?? null, {
		header: 'Project',
		cell: ({ row }) => {
			return renderComponent(DataTableProject, {
				name: row.original.project?.name,
				id: row.original.project?.id
			});
		}
	}),

	columnHelper.accessor('state', {
		header: 'State',
		cell: ({ row, table }) => {
			if (row.original.state) {
				return renderComponent(DataTableState, {
					...row.original.state,
					states: table.options.meta?.states ?? [],
					partId: row.original.id
				});
			}
		}
	}),

	columnHelper.accessor((row) => row.currentStep?.step.name ?? null, {
		header: 'Current Step'
	}),

	columnHelper.accessor('assignee', {
		header: 'Assignee',
		cell: ({ row }) => {
			return renderComponent(DataTableAssignee, { ...row.original.assignee });
		}
	}),

	columnHelper.display({
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	})
]);
