<script lang="ts">
  import {
    getIsSleepMetricEnabled,
    setIsSleepMetricEnabled,
    trackers,
    type CountDown,
    type Counter,
    type WorldClock
  } from '@/modules/trackers/state.svelte'
  import Clock from '@/components/atoms/metrics/WorldClock.svelte'
  import Countdown from '../atoms/metrics/Countdown.svelte'
  import { onMount } from 'svelte'
  import Sleep from '../atoms/metrics/Sleep.svelte'
  import { AuthClient } from '@/oauth2/auth'
  import { FitbitAuthProvider } from '@/oauth2/providers'
  import { FitbitClient } from '@/api/fitbit'
  import { createQuery } from '@tanstack/svelte-query'
  import { derived, writable } from 'svelte/store'
  import lscache from 'lscache'

  type Metric = CountDown | WorldClock | Counter

  const STORAGE_KEY = 'fitbit::sleep_minutes'

  const authClient = new AuthClient(new FitbitAuthProvider())
  const fitbitClient = new FitbitClient(authClient)

  const props: { metrics?: Metric[] } = $props()
  const sleepMetricEnabled = writable<boolean>(false)
  const shouldFetch = writable<boolean>(false)

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

  const sleepQuery = createQuery(
    derived([shouldFetch, sleepMetricEnabled], ([shouldFetch, sleepMetricEnabled]) => ({
      queryKey: ['fitbit', 'sleep'],
      enabled: shouldFetch && sleepMetricEnabled,
      queryFn: async () => {
        const cacheMinutes = lscache.get(STORAGE_KEY)
        if (cacheMinutes) {
          return cacheMinutes
        }
        const sleepMinutes = await fitbitClient.getSleep()
        if (sleepMinutes) {
          lscache.set(STORAGE_KEY, sleepMinutes)
        }
        return sleepMinutes
      }
    })
  ))

  async function authenticate() {
    if (await authClient.authenticate()) {
      $shouldFetch = true
    }
  }

  onMount(async () => {
    $sleepMetricEnabled = getIsSleepMetricEnabled()
    if ($sleepMetricEnabled) {
      $shouldFetch = true
    }
  })
</script>

{#if !!metrics.length}
  <div class="flex flex-row gap-5">
    {#each metrics as metric, i (i)}
      {#if isClock(metric)}
        <Clock metric={metric} />
      {:else if isCounter(metric)}
        <Countdown metric={metric} />
      {:else}
        <div class="text-white rounded-lg text-right">
          <p class="text-base">{metric.value}</p>
          <p class="text-xs">{metric.name}</p>
        </div>
      {/if}
    {/each}
    {#if $sleepMetricEnabled}
      <Sleep
        class="cursor-pointer"
        onclick={() => {
          if (confirm('Remove sleep metric?')) {
            setIsSleepMetricEnabled(false)
            $sleepMetricEnabled = false
          }
        }}
        oncontextmenu={(e) => {
          e.preventDefault()
          authenticate()
        }}
        loading={$sleepQuery.isLoading}
        minutes={$sleepQuery.data ?? 0} />
    {/if}
  </div>
{/if}
