<script lang="ts">
	import PageHeader from '$lib/components/sidebar/page-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<PageHeader>
	<div class="flex w-full items-center">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Page>Parts</Breadcrumb.Page>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>{data.part.name}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</PageHeader>

<h1>Actual Page</h1>
