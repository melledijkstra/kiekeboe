<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Panel from '@/components/atoms/Panel.svelte'
  import Toggle from '@/components/atoms/Toggle.svelte'

  const { Story } = defineMeta({
    title: 'Atoms/Panel',
    component: Panel,
  })
</script>

<Story name="Default">
  <div>Hello World!</div>
</Story>

<Story name="With Components">
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl font-bold">Hello, world!</h1>
    <p class="text-base">This is a panel component.</p>
    <Toggle parentClass="mt-2" label="Test Label" />
  </div>
</Story>

