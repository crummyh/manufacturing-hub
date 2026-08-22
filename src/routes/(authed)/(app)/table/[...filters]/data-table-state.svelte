<script lang="ts">
 import * as Select from "$lib/components/ui/select/index";
	import { getErrorMessage } from "$lib/utils";
	import { toast } from "svelte-sonner";

 interface Props {
   partId: number;
   id?: number;
   name?: string;
   states: {
       id: number;
       name: string;
   }[]
 }

 let { id, name, states, partId }: Props = $props();

 // svelte-ignore state_referenced_locally
 let idString = $state(id?.toString());

 async function valueChange(value: string) {
   const oldValue = idString;
   idString = value;
   name = states.find((s) => s.id.toString() === value)?.name;

   const formData = new FormData();
   formData.append("partId", partId.toString());
   formData.append("newStateId", value);

   try {
     const response = await fetch("?/setState", {
       method: "POST",
       body: formData,
     })
     if (!response.ok) {
       toast.error(`Failed to set state: ${await response.text()}`);
       idString = oldValue;
     }
   } catch (e) {
     const msg = getErrorMessage(e);
     toast.error(`Failed to set state: ${msg}`);
     idString = oldValue;
   }
 }
</script>

<Select.Root type="single" bind:value={idString} onValueChange={valueChange}>
    <Select.Trigger class="w-full">
        {name}
    </Select.Trigger>
    <Select.Content>
        {#each states as state (state.id)}
            <Select.Item value={state.id.toString()}>{state.name}</Select.Item>
        {/each}
    </Select.Content>
</Select.Root>
