<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Button from '../components/Button.svelte'
  import { fn } from '@storybook/test'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      label: 'string'
    },
    args: {
      onclick: fn()
    }
  })
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" args={{ label: 'Click me!' }}>
  {#snippet children({ label, ...args }: { label: string })}
    <Button {...args}>{label}</Button>
  {/snippet}
</Story>
