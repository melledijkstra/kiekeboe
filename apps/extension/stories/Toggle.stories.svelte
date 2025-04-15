<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Toggle from '@/components/Toggle.svelte'
  import { fn } from '@storybook/test'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Components/Toggle',
    component: Toggle,
    tags: ['autodocs'],
    argTypes: {},
    args: {
      onchange: fn()
    }
  })
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Checked" args={{ checked: true, label: 'Toggle dark mode' }} />

<Story name="Not Checked" args={{ label: 'Toggle dark mode' }} />
