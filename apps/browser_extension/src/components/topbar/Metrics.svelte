<script lang="ts">
  import { fade } from 'svelte/transition'
  import {
    trackers,
    type CountDown,
    type WorldClock
  } from '@/modules/trackers/state.svelte'
  import { calculateDays, renderTimezone, repeatEvery } from '@/time/utils'
  import { onDestroy, onMount } from 'svelte'

  let updateKey = $state(Date.now())
  let cancelUpdater = $state<() => void>()

  const metrics = $derived.by(() => {
    const pinnedCounters = trackers.counters.filter((counter) => counter.pinned)
    const pinnedClocks = trackers.worldClocks.filter((clock) => clock.pinned)
    const pinnedCountdowns = trackers.countdowns.filter(
      (countdown) => countdown.pinned
    )
    return [...pinnedClocks, ...pinnedCountdowns, ...pinnedCounters]
  })

  function isCounter(metric: unknown): metric is CountDown {
    return typeof (metric as CountDown)?.date !== 'undefined'
  }

  function isClock(metric: unknown): metric is WorldClock {
    return typeof (metric as WorldClock)?.timeZone !== 'undefined'
  }

  onMount(() => {
    cancelUpdater = repeatEvery(() => {
      updateKey = Date.now()
    }, 60 * 1000) // every minute
  })

  onDestroy(() => {
    cancelUpdater?.()
  })
</script>

{#snippet clock(metric: WorldClock)}
  <div transition:fade class="text-white px-2 rounded-lg text-right">
    {#key updateKey}
      <p class="text-lg">{renderTimezone(metric.timeZone)}</p>
    {/key}
    <p class="text-xs">{metric.name}</p>
  </div>
{/snippet}

{#snippet counter(metric: CountDown)}
  <div transition:fade class="text-white px-2 rounded-lg text-right">
    <p class="text-lg">{calculateDays(metric.date)}d</p>
    <p class="text-xs">{metric.name}</p>
  </div>
{/snippet}

{#each metrics as metric}
  {#if isClock(metric)}
    {@render clock(metric)}
  {:else if isCounter(metric)}
    {@render counter(metric)}
  {/if}
{/each}
