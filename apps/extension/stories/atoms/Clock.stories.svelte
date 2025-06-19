<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Clock from '@/components/Clock.svelte'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Atoms/Clock',
    component: Clock,
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
    }
  })
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" args={{ clockMode: 'time' }} />

<Story name="Percentage" args={{ clockMode: 'percentage' }} />
