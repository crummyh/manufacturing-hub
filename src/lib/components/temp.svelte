<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Reorderable, ReorderableHandle } from '$lib/components/ui/reorderable';
	import X from '@lucide/svelte/icons/x';

	type ProcessStep = {
		id: string;
		name: string;
		estimatedMinutes: number;
	};

	let steps = $state<ProcessStep[]>([
		{ id: crypto.randomUUID(), name: 'Waterjet cut', estimatedMinutes: 20 },
		{ id: crypto.randomUUID(), name: 'Deburr', estimatedMinutes: 10 },
		{ id: crypto.randomUUID(), name: 'CNC mill', estimatedMinutes: 45 },
		{ id: crypto.randomUUID(), name: 'Anodize', estimatedMinutes: 0 }
	]);

	function removeStep(id: string) {
		steps = steps.filter((s) => s.id !== id);
	}
</script>

<Reorderable bind:items={steps} key={(step) => step.id} class="max-w-md">
	{#snippet item(step, index, { handleProps })}
		<ReorderableHandle {...handleProps} />
		<span class="text-muted-foreground w-5 text-sm tabular-nums">{index + 1}.</span>
		<Input bind:value={step.name} placeholder="Step name" class="flex-1" />
		<Input type="number" bind:value={step.estimatedMinutes} placeholder="Min" class="w-16" />
		<Button
			variant="ghost"
			size="icon"
			type="button"
			aria-label={`Remove ${step.name}`}
			onclick={() => removeStep(step.id)}
		>
			<X class="size-4" />
		</Button>
	{/snippet}
</Reorderable>
