<script lang="ts">
  import type { WorldClock } from "@/modules/trackers/state.svelte"
  import { renderTimezone, repeatEvery } from "@/time/utils"
  import { onDestroy, onMount } from "svelte"

  const { metric }: { metric: WorldClock} = $props()

  let updateKey = $state(Date.now())

  let cancelUpdater = $state<() => void>()
  
  onMount(() => {
    cancelUpdater = repeatEvery(() => {
      updateKey = Date.now()
    }, 60 * 1000) // every minute
  })

  onDestroy(() => {
    cancelUpdater?.()
  })
</script>

<div class="text-white rounded-lg text-right">
  {#key updateKey}
    <p class="text-base">{renderTimezone(metric.timeZone)}</p>
  {/key}
  <p class="text-xs">{metric.name}</p>
</div>