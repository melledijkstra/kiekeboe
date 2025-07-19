<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import DotCalendar from '@/components/atoms/DotCalendar.svelte'

  const { Story } = defineMeta({
    title: 'Atoms/Calendar/DotCalendar',
    component: DotCalendar,
  })
</script>

<Story name="Default">
  <DotCalendar />
</Story>
