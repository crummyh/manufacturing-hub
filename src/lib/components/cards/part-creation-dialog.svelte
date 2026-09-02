<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { NewPartSchemaClient } from '$lib/schemas/forms';
	import type { Projects } from '$lib/schemas/project';
	import type { Steps } from '$lib/schemas/step';
	import type { Templates } from '$lib/server/db/queries';
	import type { InferIn, SuperValidated } from 'sveltekit-superforms';

	import Spinner from '../ui/spinner/spinner.svelte';
	import PartCreationForm from './part-creation-form.svelte';

	interface Props {
		data: Promise<{
			form: SuperValidated<InferIn<NewPartSchemaClient>>;
			projects: Projects;
			steps: Steps;
			templates: Templates;
		}>;
		open: boolean;
	}

	let { data, open = $bindable() }: Props = $props();
</script>

<Dialog.Content class="sm:max-w-xl" showCloseButton={false}>
	{#await data}
		<div class="flex h-60 items-center justify-center">
			<Spinner />
		</div>
	{:then resolved}
		<PartCreationForm {...resolved} bind:open />
	{:catch}
		<div class="text-destructive py-8 text-center">
			Couldn't load the form. Please close and try again.
		</div>
	{/await}
</Dialog.Content>
