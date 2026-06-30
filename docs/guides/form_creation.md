# Form Creation

Svelte has very powerful tools for creating effective forms, but this project uses Superforms, zod, and Formsnap to make them even better. But this adds some complexity.

## 1. Create a schema

```ts
import { z } from "zod";
 
export const formSchema = z.object({
 username: z.string().min(2).max(50),
});
 
export type FormSchema = typeof formSchema;
```

## 2. Add the form to the load function

```ts
import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";
 
export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(formSchema)),
  };
};
```

## 3. Create the frontend form

This part of the form should *not* be in `+page.svelte`, but rather in a separate component.

### a. Take the form from the load function

```ts
import { formSchema, type FormSchema } from "./schema";
import {
  type SuperValidated,
  type Infer,
  superForm,
} from "sveltekit-superforms";
import { zod4Client } from "sveltekit-superforms/adapters";

let { form: initialForm }: { form: SuperValidated<Infer<FormSchema>> } = $props();
```

### b. Set up the superform

```ts
const form = superForm(initialForm, {
   validators: zod4Client(formSchema),
 });

 const { form: formData, enhance } = form;
```

### c. Create the form base

```svelte
<form method="POST" use:enhance>
  <!-- Fields here -->
  <Form.Button>Submit</Form.Button>
</form>
```

### d. Add fields

Each field follows this pattern, replacing `username` with the actual name

```svelte
<Form.Field {form} name="username">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Username</Form.Label>
      <Input {...props} bind:value={$formData.username} />
    {/snippet}
  </Form.Control>
  <Form.Description>This is your public display name.</Form.Description>
  <Form.FieldErrors />
</Form.Field>
```

### e. Add the form to the page

```svelte
<script lang="ts">
  import type { PageData } from "./$types.js";
  import SettingsForm from "./settings-form.svelte";
  let { data }: { data: PageData } = $props();
</script>
 
<SettingsForm form={data.form} />
```

## Create the server action

```ts
export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    return {
      form,
    };
  },
};
```

## Extra Features

Superforms has a lot more then that! Here are some common things that you might want to add:

### Loading Spinner

Just take the `delayed` store when creating the form:

```diff
const form = superForm(initialForm, {
   validators: zod4Client(formSchema),
 });

- const { form: formData, enhance } = form;
+ const { form: formData, enhance, delayed } = form;
```

Then add an if block:

```svelte
<Form.Button>Submit</Form.Button>
{#if $delayed}<Spinner />{/if}
```
