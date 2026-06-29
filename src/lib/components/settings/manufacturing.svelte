<script lang="ts">
	import SettingsSection from "../settings-section.svelte";
	import * as Card from "../ui/card";
	import * as Table from "../ui/table";
	import type { PageData } from "../../../routes/(authed)/settings/$types";
	import { Input } from "../ui/input";
	import { Button } from "../ui/button";
    import { PencilIcon, Plus, Trash } from '@lucide/svelte';

    let { data }: { data: PageData } = $props();
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
                <Table.Footer class="bg-background">
                    <Table.Row>
                        <Table.Cell><Input /></Table.Cell>
                        <Table.Cell colspan={2}><Input /></Table.Cell>
                        <Table.Cell
                            ><Button size="icon"><Plus /></Button></Table.Cell
                        >
                    </Table.Row>
                </Table.Footer>
            </Table.Root>
        </Card.Content>
        <Card.Footer>
            <Button variant="default" disabled>Save changes</Button>
        </Card.Footer>
    </Card.Root>
</SettingsSection>