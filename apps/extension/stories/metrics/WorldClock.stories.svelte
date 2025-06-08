<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import WorldClock from '@/components/atoms/metrics/WorldClock.svelte'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Metrics (localstorage)/World Clock',
    component: WorldClock,
    argTypes: {
      metric: {
        type: 'symbol',
        control: 'object',
      }
    },
    args: {
      metric: {
        name: 'Storybook Test',
        pinned: true,
        timeZone: 'Europe/Amsterdam'
      }
    }
  })
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" />
