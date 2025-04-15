<script module lang="ts">
  import { defineMeta, type Args } from '@storybook/addon-svelte-csf'
  import Panel from '@/components/Panel.svelte'
  import Toggle from '@/components/atoms/Toggle.svelte'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Atoms/Panel',
    component: Panel,
    parameters: {
      backgrounds: {
        default: 'dark'
      }
    }
  })
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default">
  {#snippet children({
    children = 'Hello, world!',
    ...args
  })}
    <Panel {...args}>{children}</Panel>
  {/snippet}
</Story>

<Story name="With Components">
  {#snippet children(args: any)}
    <Panel {...args}>
      <h1 class="text-2xl font-bold">Hello, world!</h1>
      <p class="text-base">This is a panel component.</p>
      <Toggle parentClass="mt-2" label={'Test Label'} />
    </Panel>
  {/snippet}
</Story>
