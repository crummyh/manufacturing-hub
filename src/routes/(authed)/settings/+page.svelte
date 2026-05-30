<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import CurrentUserNavDropdown from '$lib/components/current-user-nav-dropdown.svelte';
	import SettingsSection from '$lib/components/settings-section.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import { Switch } from '$lib/components/ui/switch/index';
	import * as Table from '$lib/components/ui/table/index';
	import { userAbbr } from '$lib/utils';
	import type { PageData } from './$types';
	import { PencilIcon, Plus, Trash, type LucideIcon } from '@lucide/svelte';
	import BellIcon from '@lucide/svelte/icons/bell';
	import CogIcon from '@lucide/svelte/icons/cog';
	import KeyRoundIcon from '@lucide/svelte/icons/key-round';
	import UserIcon from '@lucide/svelte/icons/user';

	let { data }: { data: PageData } = $props();

	type SectionId = 'profile' | 'account' | 'notifications' | 'manufacturing';

	const sections: { id: SectionId; label: string; Icon: LucideIcon }[] = [
		{ id: 'profile', label: 'Profile', Icon: UserIcon },
		{ id: 'account', label: 'Account', Icon: KeyRoundIcon },
		{ id: 'notifications', label: 'Notifications', Icon: BellIcon },
		{ id: 'manufacturing', label: 'Manufacturing', Icon: CogIcon }
	];

	const activeSection = $derived<SectionId>(
		(page.url.searchParams.get('section') as SectionId) ?? 'profile'
	);
</script>

<header class="border-b bg-background">
	<div class="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
		<div class="flex items-center gap-6">
			<a href={resolve('/')} class="text-sm font-semibold">MyApp</a>
			<h1 class="underline">Settings</h1>
		</div>
		<CurrentUserNavDropdown user={data.user} />
	</div>
</header>

<div class="mx-auto max-w-screen-xl px-4 py-8">
	<div class="flex gap-8">
		<!-- Sidebar nav -->
		<nav class="w-48 shrink-0">
			<ul class="flex flex-col gap-1">
				{#each sections as { id, label, Icon } (id)}
					<li>
						<a
							href={resolve(`/settings?section=${id}`)}
							class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted {activeSection ===
							id
								? 'bg-muted font-medium text-foreground'
								: 'text-muted-foreground'}"
						>
							<Icon class="size-4" />
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<Separator orientation="vertical" class="h-auto" />

		<!-- Section content -->
		<main class="min-w-0 flex-1">
			{#if activeSection === 'profile'}
				<SettingsSection name="Profile" description="Manage your public profile information.">
					<Card.Root>
						<Card.Header>
							<Card.Title>Avatar</Card.Title>
							<Card.Description>Your profile picture from your sign-in provider.</Card.Description>
						</Card.Header>
						<Card.Content>
							<Avatar.Root class="size-16">
								<Avatar.Image src={data.user.image ?? undefined} alt={data.user.name} />
								<Avatar.Fallback class="text-lg">{userAbbr(data.user.name)}</Avatar.Fallback>
							</Avatar.Root>
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
			{:else if activeSection === 'account'}
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
			{:else if activeSection === 'notifications'}
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
			{:else if activeSection === 'manufacturing'}
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
										<!-- <Table.Head>Edit</Table.Head>
										<Table.Head>Delete</Table.Head> -->
									</Table.Row>
								</Table.Header>
								<Table.Body>
									<Table.Row>
										<Table.Cell class="font-medium">6061</Table.Cell>
										<Table.Cell>6061 - Aluminum</Table.Cell>
										<Table.Cell
											><Button variant="outline" size="icon"><PencilIcon /></Button></Table.Cell
										>
										<Table.Cell
											><Button variant="destructive" size="icon"><Trash /></Button></Table.Cell
										>
									</Table.Row>
									<Table.Row>
										<Table.Cell class="font-medium">Poly</Table.Cell>
										<Table.Cell>Polycarbonate</Table.Cell>
										<Table.Cell
											><Button variant="outline" size="icon"><PencilIcon /></Button></Table.Cell
										>
										<Table.Cell
											><Button variant="destructive" size="icon"><Trash /></Button></Table.Cell
										>
									</Table.Row>
								</Table.Body>
								<Table.Footer class="bg-background">
									<Table.Row>
										<Table.Cell><Input /></Table.Cell>
										<Table.Cell><Input /></Table.Cell>
										<Table.Cell colspan={2} class="ms-auto"
											><Button size="icon"><Plus /></Button></Table.Cell
										>
									</Table.Row>
								</Table.Footer>
							</Table.Root>
						</Card.Content>
						<Card.Footer>
							<Button variant="outline" disabled>Disconnect</Button>
						</Card.Footer>
					</Card.Root>
				</SettingsSection>
			{/if}
		</main>
	</div>
</div>
