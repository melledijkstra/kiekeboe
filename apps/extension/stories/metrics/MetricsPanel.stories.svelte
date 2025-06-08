<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Metrics from '@/components/topbar/Metrics.svelte'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Metrics (localstorage)',
    component: Metrics,
    argTypes: {},
    args: {}
  })
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default">
  <Metrics />
</Story>
