<script module lang="ts">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf'
  import Button from '@/components/Button.svelte'
  import { fn } from '@storybook/test'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Atoms/Buttons/Normal',
    component: Button,
    args: {
      onclick: fn()
    }
  })
</script>

<script>
  setTemplate(template)
</script>

{#snippet template({ label, ...args }: { label?: string })}
  <Button {...args}>{label}</Button>
{/snippet}

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" />
