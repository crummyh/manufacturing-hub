<script lang="ts">
	import {
		newFinishSchema,
		newMaterialSchema,
		newThicknessSchema,
		type NewFinishSchema,
		type NewMaterialSchema,
		type NewThicknessSchema
	} from '$lib/zod-schemas';
	import type { PageData } from '../../../routes/(authed)/settings/$types';
	import SettingsSection from '../settings-section.svelte';
	import { Button } from '../ui/button';
	import * as Card from '../ui/card';
	import * as Form from '../ui/form';
	import { Input } from '../ui/input';
	import * as Table from '../ui/table';
	import { PencilIcon, Plus, Trash } from '@lucide/svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import type { Infer } from 'zod';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// svelte-ignore state_referenced_locally
	const newMaterialForm = superForm(data.newMaterialForm, {
		validators: zod4Client(newMaterialSchema)
	});

	// svelte-ignore state_referenced_locally
	const newFinishForm = superForm(data.newFinishForm, {
		validators: zod4Client(newFinishSchema)
	});

	// svelte-ignore state_referenced_locally
	const newThicknessForm = superForm(data.newThicknessForm, {
		validators: zod4Client(newThicknessSchema)
	});

	const { form: newMaterialData, enhance: newMaterialEnhance } = newMaterialForm;
	const { form: newFinishData, enhance: newFinishEnhance } = newFinishForm;
	const { form: newThicknessData, enhance: newThicknessEnhance } = newThicknessForm;
</script>

<SettingsSection name="Manufacturing" description="Configure the part production process.">
	<Card.Root>
		<Card.Header>
			<Card.Title>Materials</Card.Title>
			<Card.Description>Organization wide possible part materials</Card.Description>
		</Card.Header>
		<Card.Content class="flex items-center justify-between">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Onshape Name</Table.Head>
						<Table.Head class="w-0"></Table.Head>
						<Table.Head class="w-0"></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.materials as material (material.id)}
						<Table.Row>
							<Table.Cell class="font-medium">{material.name}</Table.Cell>
							<Table.Cell>{material.onshapeName}</Table.Cell>
							<Table.Cell class="text-right">
								<Button variant="outline" size="icon"><PencilIcon /></Button>
							</Table.Cell>
							<Table.Cell class="text-right">
								<Button variant="destructive" size="icon"><Trash /></Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
				<form action="POST" use:newMaterialEnhance>
					<Table.Footer class="bg-background">
						<Table.Row>
							<Table.Cell>
								<Form.Field form={newMaterialForm} name="name">
									<Form.Control>
										{#snippet children({ props })}
											<Input {...props} bind:value={$newMaterialData.name} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</Table.Cell>
							<Table.Cell colspan={2}>
								<Form.Field form={newMaterialForm} name="name">
									<Form.Control>
										{#snippet children({ props })}
											<Input {...props} bind:value={$newMaterialData.onshapeName} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field></Table.Cell
							>
							<Table.Cell><Form.Button size="icon"><Plus /></Form.Button></Table.Cell>
						</Table.Row>
					</Table.Footer>
				</form>
			</Table.Root>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Finishes</Card.Title>
			<Card.Description>Organization wide possible part finishes</Card.Description>
		</Card.Header>
		<Card.Content class="flex items-center justify-between">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head class="w-0"></Table.Head>
						<Table.Head class="w-0"></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.finishes as finish (finish.id)}
						<Table.Row>
							<Table.Cell class="font-medium">{finish.name}</Table.Cell>
							<Table.Cell class="text-right">
								<Button variant="outline" size="icon"><PencilIcon /></Button>
							</Table.Cell>
							<Table.Cell class="text-right">
								<Button variant="destructive" size="icon"><Trash /></Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
				<Table.Footer class="bg-background">
					<Table.Row>
						<Table.Cell colspan={2}><Input /></Table.Cell>
						<Table.Cell><Button size="icon"><Plus /></Button></Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table.Root>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Thicknesses</Card.Title>
			<Card.Description>Organization wide possible part thicknesses</Card.Description>
		</Card.Header>
		<Card.Content class="flex items-center justify-between">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head class="w-0"></Table.Head>
						<Table.Head class="w-0"></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.thicknesses as thickness (thickness.id)}
						<Table.Row>
							<Table.Cell class="font-medium">{thickness.name}</Table.Cell>
							<Table.Cell class="text-right">
								<Button variant="outline" size="icon"><PencilIcon /></Button>
							</Table.Cell>
							<Table.Cell class="text-right">
								<Button variant="destructive" size="icon"><Trash /></Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
				<Table.Footer class="bg-background">
					<Table.Row>
						<Table.Cell colspan={2}><Input /></Table.Cell>
						<Table.Cell><Button size="icon"><Plus /></Button></Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</SettingsSection>
