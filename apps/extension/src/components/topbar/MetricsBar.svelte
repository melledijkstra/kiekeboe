<script lang="ts">
  import lscache from 'lscache'
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
  import { FitbitClient } from '@/api/fitbit'

  type Metric = CountDown | WorldClock | Counter

  const STORAGE_KEY = 'fitbit::sleep_minutes'

  const authClient = new AuthClient('fitbit')

  const props: { metrics?: Metric[] } = $props()
  let sleepMetricEnabled = $state(false)
  let token = $state<string>()
  let client = $state<FitbitClient>()

  let sleepMinutes = $state<number>(0) // Default to 8 hours in minutes

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

  async function getSleepData(token: string) {
    if (!client) {
      client = new FitbitClient(token)
    }
    sleepMinutes = await client.getSleep()
    lscache.set(STORAGE_KEY, sleepMinutes, 60 * 1) // Cache for 1 hour
  }

  async function authenticate() {
    const tokenData = await authClient.getAuthToken(true)
    if (tokenData) {
      token = tokenData
      getSleepData(token)
    }
  }

  onMount(async () => {
    sleepMetricEnabled = getIsSleepMetricEnabled()
    if (!sleepMetricEnabled) {
      return
    }

    const cacheSleepMinutes = lscache.get(STORAGE_KEY)

    // if we have cached sleep minutes, use them
    if (cacheSleepMinutes) {
      sleepMinutes = cacheSleepMinutes
      return
    }

    const tokenData = await authClient.getTokenFromStoreOrRefreshToken()
    
    if (tokenData) {
      token = tokenData
      getSleepData(token)
    }
  })
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
    {#if sleepMetricEnabled}
      <Sleep
        class="cursor-pointer"
        onclick={() => setIsSleepMetricEnabled(false)}
        oncontextmenu={(e) => {
          e.preventDefault()
          authenticate()
        }}
        minutes={sleepMinutes} />
    {/if}
  </div>
{/if}
