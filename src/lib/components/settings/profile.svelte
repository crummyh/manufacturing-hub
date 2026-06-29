<script lang="ts">
	import SettingsSection from "../settings-section.svelte";
	import * as Card from "../ui/card";
	import type { PageData } from "../../../routes/(authed)/settings/$types";
	import UserAvatar from "../user_avatar.svelte";
	import { Label } from "../ui/label";
	import { Input } from "../ui/input";
	import { Button } from "../ui/button";

    let { data }: { data: PageData } = $props();
</script>

<SettingsSection name="Profile" description="Manage your public profile information.">
    <Card.Root>
        <Card.Header>
            <Card.Title>Avatar</Card.Title>
            <Card.Description>Your profile picture from your sign-in provider.</Card.Description>
        </Card.Header>
        <Card.Content>
            <UserAvatar image={data.user.image ?? undefined} name={data.user.name} class="size-16" />
        </Card.Content>
    </Card.Root>
    <Card.Root>
        <Card.Header>
            <Card.Title>Display Name</Card.Title>
            <Card.Description>Your name as it appears across the app.</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-2">
            <Label for="display-name">Name</Label>
            <Input id="display-name" value={data.user.name} disabled />
        </Card.Content>
        <Card.Footer>
            <Button variant="outline" disabled>Save changes</Button>
        </Card.Footer>
    </Card.Root>
</SettingsSection>