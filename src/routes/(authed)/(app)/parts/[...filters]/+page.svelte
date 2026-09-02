<script lang="ts">
	import BasicHeaderButtons from '$lib/components/sidebar/basic-header-buttons.svelte';
	import PageHeader from '$lib/components/sidebar/page-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';

	import type { PageProps } from './$types';
	import { columns } from './columns';
	import DataTable from './data-table.svelte';

	let { data }: PageProps = $props();
</script>

<PageHeader>
	<div class="flex justify-between w-full items-center">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Page>Parts</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<BasicHeaderButtons data={data.navData} />
	</div>
</PageHeader>

<div class="px-4">
	<DataTable data={data.parts} states={data.states} {columns} />
</div>
