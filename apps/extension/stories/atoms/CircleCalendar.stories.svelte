<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import CircleCalendar from '@/components/atoms/CircleCalendar.svelte'

  const { Story } = defineMeta({
    title: 'Atoms/Calendar/CircleCalendar',
    component: CircleCalendar,
  })
</script>

<Story name="Default">
  <CircleCalendar />
</Story>
