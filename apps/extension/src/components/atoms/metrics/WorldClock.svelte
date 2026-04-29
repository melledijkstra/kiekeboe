<script lang="ts">
  import type { WorldClock } from "@/modules/trackers/state.svelte"
  import { renderTimezone, repeatEvery } from "@/time/utils"
  import { onDestroy, onMount } from "svelte"
  import { fade } from "svelte/transition"

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

<div transition:fade class="dark:text-white text-black rounded-lg">
  <p class="text-sm font-bold truncate leading-tight">{metric.name}</p>
  {#key updateKey}
    <p class="text-xs opacity-70 truncate">{renderTimezone(metric.timeZone)}</p>
  {/key}
</div>