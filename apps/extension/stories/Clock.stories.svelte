<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Clock from '@/components/Clock.svelte'
  import { fn } from '@storybook/test'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Components/Clock',
    component: Clock,
    tags: ['autodocs'],
    parameters: {
      backgrounds: {
        values: [
          {
            name: 'gray',
            value: '#d5d5d587'
          }
        ],
        default: 'gray'
      }
    },
    argTypes: {},
    args: {
      onchange: fn()
    }
  })
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" />
