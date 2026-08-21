<script lang="ts">
	import BasicHeaderButtons from '$lib/components/sidebar/basic-header-buttons.svelte';
	import PageHeader from '$lib/components/sidebar/page-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<PageHeader>
	<div class="flex justify-between w-full items-center">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Page>Table</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<BasicHeaderButtons
			form={data.partCreationForm}
			projects={data.projects}
			steps={data.steps}
			templates={data.templates}
		/>
	</div>
</PageHeader>
