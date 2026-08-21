<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { newPartSchemaClient, type NewPartSchemaClient } from '$lib/schemas/forms';
	import type { Projects } from '$lib/schemas/project';
	import type { Steps } from '$lib/schemas/step';
	import type { Templates } from '$lib/server/db/queries';
	import ButtonGroup from '../ui/button-group/button-group.svelte';
	import Button from '../ui/button/button.svelte';
	import Label from '../ui/label/label.svelte';
	import * as Popover from '../ui/popover';
	import ScrollArea from '../ui/scroll-area/scroll-area.svelte';
	import SearchableMenu from '../ui/searchable-menu/searchable-menu.svelte';
	import Spinner from '../ui/spinner/spinner.svelte';
	import Switch from '../ui/switch/switch.svelte';
	import { ChevronDown, ChevronUp, Import, Plus, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { flip } from 'svelte/animate';
	import { scale } from 'svelte/transition';
	import { type SuperValidated, superForm, type InferIn } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	interface Props {
		form: SuperValidated<InferIn<NewPartSchemaClient>>;
		projects: Projects;
		open: boolean;
		steps: Steps;
		templates: Templates;
	}

	// eslint-disable-next-line no-useless-assignment
	let { form: initialForm, projects, steps, open = $bindable(), templates }: Props = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(initialForm, {
		dataType: 'json',
		validators: zod4Client(newPartSchemaClient),
		async onUpdated({ form }) {
			if (form.valid) {
				open = false;
				toast.success('Part created');
				await invalidateAll();
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	let templatePopoverOpen = $state(false);

	function addStep(id: string) {
		// Mainly here to avoid issues with the each block
		if ($formData.steps.includes(id)) {
			toast.error("Can't add duplicate step");
			return;
		}

		// Makes sure that formData updates
		formData.update((fd) => {
			fd.steps.push(id);
			return fd;
		});
	}

	function removeStep(id: string) {
		if (!$formData.steps.includes(id)) {
			console.error(`Failed to remove step with id ${id}: not in list`);
			return;
		}
		$formData.steps = $formData.steps.filter((s) => s !== id);
	}

	function moveUp(index: number) {
		if (index === 0) return;

		// Makes sure that formData updates
		formData.update((fd) => {
			[fd.steps[index - 1], fd.steps[index]] = [fd.steps[index], fd.steps[index - 1]];
			return fd;
		});
	}

	function moveDown(index: number) {
		if (index === $formData.steps.length - 1) return;

		// Makes sure that formData updates
		formData.update((fd) => {
			[fd.steps[index + 1], fd.steps[index]] = [fd.steps[index], fd.steps[index + 1]];
			return fd;
		});
	}

	function importTemplate(template: Templates[number]) {
		formData.update((fd) => {
			fd.steps = template.steps.map((t) => t.id);
			return fd;
		});
	}
</script>

<Dialog.Content class="sm:max-w-xl" showCloseButton={false}>
	<form method="POST" use:enhance action="?/newPart">
		<Dialog.Header class="mb-4">
			<Dialog.Title>New Part</Dialog.Title>
		</Dialog.Header>
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input {...props} autocomplete="off" bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="quantity">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Quantity</Form.Label>
					<Input {...props} type="number" bind:value={$formData.quantity} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="projectId">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Project</Form.Label>
					<Select.Root type="single" bind:value={$formData.projectId} {...props}>
						<Select.Trigger class="w-full">
							{projects.find((p) => p.id === $formData.projectId)?.name ?? 'Select a project'}
						</Select.Trigger>
						<Select.Content>
							{#if projects.length > 0}
								{#each projects as project (project.id)}
									<Select.Item value={project.id}>{project.name}</Select.Item>
								{/each}
							{:else}
								<Select.Item disabled value="">No projects</Select.Item>
							{/if}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="critical">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex items-center gap-2">
						<Switch {...props} bind:checked={$formData.critical} />
						<Form.Label>Critical</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="space-y-2 mb-2">
			<Label>Steps</Label>
			<ScrollArea class="h-60 mb-2 p-1 rounded-md border">
				{#if $formData.steps.length > 0}
					{#each $formData.steps as step, index (step)}
						<div
							class="hover:bg-muted rounded-md px-2 py-1 flex justify-between w-full items-center"
							animate:flip={{ duration: 250 }}
							transition:scale={{ duration: 250 }}
						>
							<div>
								<span class="text-muted-foreground w-5 text-sm tabular-nums">{index + 1}.</span>
								<span class="truncate">{steps.find((s) => s.id === step)?.name}</span>
							</div>
							<div class="flex items-center gap-2">
								<ButtonGroup>
									<Button variant="outline" size="icon-sm" onclick={() => moveDown(index)}
										><ChevronDown /></Button
									>
									<Button variant="outline" size="icon-sm" onclick={() => moveUp(index)}
										><ChevronUp /></Button
									>
								</ButtonGroup>
								<Button variant="destructive" size="icon-sm" onclick={() => removeStep(step)}
									><X /></Button
								>
							</div>
						</div>
					{/each}
				{:else}
					<div class="text-muted-foreground text-center my-2" transition:scale={{ duration: 250 }}>
						No Steps
					</div>
				{/if}
			</ScrollArea>
			<div class="flex gap-2 justify-end items-center">
				<ButtonGroup>
					<SearchableMenu
						options={steps.map((s) => {
							return { value: s.id, label: s.name };
						})}
						onValueChange={addStep}
					>
						{#snippet trigger()}
							<Popover.Trigger class={buttonVariants({ variant: 'outline' })}>
								<Plus />
								Add
							</Popover.Trigger>
						{/snippet}
					</SearchableMenu>
					<Popover.Root bind:open={templatePopoverOpen}>
						<Popover.Trigger class={buttonVariants({ variant: 'outline' })}>
							<Import />
							Import
						</Popover.Trigger>
						<Popover.Content>
							{#each templates as template (template.id)}
								<button
									class="flex w-full hover:bg-secondary py-1 px-2 rounded-md"
									onclick={() => {
										importTemplate(template);
										templatePopoverOpen = false;
									}}>{template.name}</button
								>
							{/each}
						</Popover.Content>
					</Popover.Root>
				</ButtonGroup>
			</div>
		</div>
		<Dialog.Footer>
			<Dialog.Close onclick={() => form.reset()} class={buttonVariants({ variant: 'outline' })}>
				Cancel
			</Dialog.Close>
			<Form.Button type="submit" role="button" disabled={$submitting}>
				{#if $submitting}
					<Spinner />
				{/if}Submit
			</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
