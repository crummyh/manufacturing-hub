<script lang="ts">
	import SettingsSection from "../settings-section.svelte";
	import * as Card from "../ui/card";
	import type { PageData } from "../../../routes/(authed)/settings/$types";
	import { Label } from "../ui/label";
	import { Input } from "../ui/input";
	import { Button } from "../ui/button";

    let { data }: { data: PageData } = $props();
</script>

<SettingsSection name="Account" description="Manage your account credentials and security.">
    <Card.Root>
        <Card.Header>
            <Card.Title>Email</Card.Title>
            <Card.Description>The email address associated with your account.</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-2">
            <Label for="email">Email address</Label>
            <Input id="email" type="email" value={data.user.email} disabled />
        </Card.Content>
    </Card.Root>
    <Card.Root>
        <Card.Header>
            <Card.Title class="text-destructive">Danger Zone</Card.Title>
            <Card.Description>Irreversible account actions.</Card.Description>
        </Card.Header>
        <Card.Content>
            <Button variant="destructive" disabled>Delete account</Button>
        </Card.Content>
    </Card.Root>
</SettingsSection>