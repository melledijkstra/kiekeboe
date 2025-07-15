<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Clock from '@/components/Clock.svelte'

  const { Story } = defineMeta({
    title: 'Atoms/Clock',
    component: Clock,
  })
</script>

<Story name="Default" args={{ clockMode: 'time' }} />

<Story name="Percentage" args={{ clockMode: 'percentage' }} />
