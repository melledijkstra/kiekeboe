<script lang="ts">
  import type { CountDown } from '@/modules/trackers/state.svelte'
  import { calculateDays } from '@/time/utils'
  import { fade } from 'svelte/transition'

  const { metric }: { metric: CountDown } = $props()
</script>

<div transition:fade class="dark:text-white text-black rounded-lg">
  <p class="text-sm font-bold truncate leading-tight">{metric.name}</p>
  <p class="text-xs opacity-70 truncate">{calculateDays(metric.date)} days remaining</p>
</div>