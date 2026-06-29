<script lang="ts">
	import SettingsSection from "../settings-section.svelte";
	import * as Card from "../ui/card";
	import type { PageData } from "../../../routes/(authed)/settings/$types";
	import { Label } from "../ui/label";
	// import { Input } from "../ui/input";
	import { Button } from "../ui/button";
	import { Switch } from "../ui/switch";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let { data }: { data: PageData } = $props();
</script>

<SettingsSection
    name="Notifications"
    description="Choose what you want to be notified about"
>
    <Card.Root>
        <Card.Header>
            <Card.Title>Email Notifications</Card.Title>
            <Card.Description>Receive updates via email.</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-4">
            {#each [{ id: 'notif-part-status', label: 'Part status changes', description: 'When a part moves to a new stage' }, { id: 'notif-assignments', label: 'Assignments', description: 'When a part is assigned to you' }, { id: 'notif-comments', label: 'Comments', description: 'When someone comments on your parts' }] as item (item.id)}
                <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                        <Label for={item.id}>{item.label}</Label>
                        <p class="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch id={item.id} disabled />
                </div>
            {/each}
        </Card.Content>
        <Card.Footer>
            <Button variant="outline" disabled>Save preferences</Button>
        </Card.Footer>
    </Card.Root>
</SettingsSection>