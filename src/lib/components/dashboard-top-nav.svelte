<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Finishes, Materials, Thicknesses } from '$lib/server/db/helpers/kanban';
	import type { ManualPartSchema } from '$lib/zod-schemas';
	import CurrentUserNavDropdown from './current-user-nav-dropdown.svelte';
	import DashboardNavButtons from './dashboard-nav-buttons.svelte';
	import type { User } from 'better-auth';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		user: User;
		manualPartForm: SuperValidated<Infer<ManualPartSchema>>;
		thicknesses: Thicknesses;
		materials: Materials;
		finishes: Finishes;
	}

	let { user, manualPartForm, thicknesses, materials, finishes }: Props = $props();
</script>

<header class="border-b bg-background">
	<div class="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
		<div class="flex items-center gap-6">
			<a href={resolve('/')} class="text-sm font-semibold">MyApp</a>
			<h1 class="underline">Dashboard</h1>
		</div>

		<!-- Right: User info -->
		<div class="flex items-center gap-3">
			<DashboardNavButtons {manualPartForm} {thicknesses} {materials} {finishes} />
			<CurrentUserNavDropdown {user} />
		</div>
	</div>
</header>
