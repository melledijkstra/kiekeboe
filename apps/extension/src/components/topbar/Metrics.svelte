<script lang="ts">
  import {
    trackers,
    type CountDown,
    type Counter,
    type WorldClock
  } from '@/modules/trackers/state.svelte'
  import Clock from '@/components/atoms/metrics/WorldClock.svelte'
  import Countdown from '../atoms/metrics/Countdown.svelte'

  type Metric = CountDown | WorldClock | Counter

  const props: { metrics?: Metric[] } = $props()

  const metrics: Metric[] = $derived.by(() => {
    if (props.metrics?.length) {
      return props.metrics.filter(metric => metric.pinned)
    }

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

  $inspect(metrics)
</script>

{#if !!metrics.length}
  <div class="flex flex-row gap-2">
    {#each metrics as metric}
      {#if isClock(metric)}
        <Clock metric={metric} />
      {:else if isCounter(metric)}
        <Countdown metric={metric} />
      {:else}
        <div class="text-white px-2 rounded-lg text-right">
          <p class="text-lg">{metric.value}</p>
          <p class="text-xs">{metric.name}</p>
        </div>
      {/if}
    {/each}
  </div>
{/if}
