<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Form from '$lib/components/ui/form/index.js';
	import type { Finishes, Materials, Thicknesses } from '$lib/server/db/helpers/kanban';
	import { manualPartSchema, type ManualPartSchema } from '$lib/zod-schemas';
	import SearchableSelect from '../searchable-select.svelte';
	import { buttonVariants } from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';
	import Spinner from '../ui/spinner/spinner.svelte';
	import Switch from '../ui/switch/switch.svelte';
	import { toast } from 'svelte-sonner';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import type { Infer } from 'zod';

	interface Props {
		manualPartForm: SuperValidated<Infer<ManualPartSchema>>;
		thicknesses: Thicknesses;
		materials: Materials;
		finishes: Finishes;
		isOpen: boolean;
	}

	let { manualPartForm, thicknesses, materials, finishes, isOpen = $bindable() }: Props = $props();

	const form = superForm(manualPartForm, {
		validators: zod4Client(manualPartSchema),
		async onUpdated({ form }) {
			if (form.valid) {
				isOpen = false;
				toast.success('Created Part');
				await invalidateAll();
			}
		}
	});
	const { form: formData, enhance, submitting } = form;
</script>

<Dialog.Content class="sm:max-w-xl" showCloseButton={false}>
	<form method="POST" action="?/manualPart" use:enhance>
		<Dialog.Header class="mb-4">
			<Dialog.Title>Create Manual Task</Dialog.Title>
		</Dialog.Header>
		<div>
			<!-- Part Name -->
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Part Name<span class="text-red-500">*</span></Form.Label>
						<Input {...props} bind:value={$formData.name} autocomplete="off" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Material -->
			<Form.Field {form} name="material">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Material</Form.Label>
						<SearchableSelect
							{...props}
							options={materials.map((m) => {
								return { value: m.id.toString(), label: m.name };
							})}
							value={$formData.material?.toString()}
							onValueChange={(v) => ($formData.material = parseInt(v))}
							placeholder="Select a material…"
							class="w-full"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Thickness -->
			<Form.Field {form} name="thickness">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Thickness</Form.Label>
						<SearchableSelect
							{...props}
							options={thicknesses.map((t) => {
								return { value: t.id.toString(), label: t.name };
							})}
							value={$formData.thickness?.toString()}
							onValueChange={(v) => ($formData.thickness = parseInt(v))}
							placeholder="Select a thickness…"
							class="w-full"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Finish -->
			<Form.Field {form} name="finish">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Finish</Form.Label>
						<SearchableSelect
							{...props}
							options={finishes.map((f) => {
								return { value: f.id.toString(), label: f.name };
							})}
							value={$formData.finish?.toString()}
							onValueChange={(v) => ($formData.finish = parseInt(v))}
							placeholder="Select a finish…"
							class="w-full"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Quantity -->
			<Form.Field {form} name="quantity">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Quantity<span class="text-red-500">*</span></Form.Label>
						<Input {...props} bind:value={$formData.quantity} type="number" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="critical">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex items-center gap-2">
							<Switch {...props} bind:checked={$formData.critical} />
							<Form.Label class="">Critical</Form.Label>
						</div>
					{/snippet}
				</Form.Control>
			</Form.Field>
		</div>
		<Dialog.Footer>
			<Dialog.Close type="reset" class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close
			>
			<Form.Button type="submit" role="button" disabled={$submitting || null}
				>{#if $submitting}
					<Spinner />
				{/if}Submit</Form.Button
			>
		</Dialog.Footer>
	</form>
</Dialog.Content>
