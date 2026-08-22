<script lang="ts">
 import * as Select from "$lib/components/ui/select/index";

 interface Props {
   id?: number;
   name?: string;
   states: {
       id: number;
       name: string;
   }[]
 }

 let { id, name, states }: Props = $props();
</script>

<Select.Root type="single" value={id.toString()}>
    <Select.Trigger class="w-full">
        {name}
    </Select.Trigger>
    <Select.Content>
        {#each states as state (state.id)}
            <Select.Item value={state.id.toString()}>{state.name}</Select.Item>
        {/each}
    </Select.Content>
</Select.Root>
