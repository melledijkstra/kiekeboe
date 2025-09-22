<script lang="ts">
  import type { CountDown } from '@/modules/trackers/state.svelte'
  import { calculateDays } from '@/time/utils'

  const { metric }: { metric: CountDown } = $props()
</script>

<div class="text-white rounded-lg text-right">
  <p class="text-base">{calculateDays(metric.date)}d</p>
  <p class="text-xs">{metric.name}</p>
</div>