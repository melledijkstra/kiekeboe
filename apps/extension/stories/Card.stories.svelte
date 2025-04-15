<script module lang="ts">
  import { defineMeta, type Args } from '@storybook/addon-svelte-csf'
  import Panel from '@/components/Panel.svelte'
  import Toggle from '@/components/Toggle.svelte'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Components/Panel',
    component: Panel,
    tags: ['autodocs'],
    parameters: {
      backgrounds: {
        default: 'dark'
      }
    },
    argTypes: {},
    args: {}
  })
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" args={{ label: 'Hello, world!' }}>
  {#snippet children({ label, ...args }: { label: string })}
    <Panel {...args}>{label}</Panel>
  {/snippet}
</Story>

<Story name="With Components">
  {#snippet children(args: Args<typeof Panel>)}
    <Panel {...args}>
      <h1 class="text-2xl font-bold">Hello, world!</h1>
      <p class="text-base">This is a panel component.</p>
      <Toggle parentClass="mt-2" label={'Test Label'} />
    </Panel>
  {/snippet}
</Story>
