<script lang="ts">
  import Icon from '@/components/Icon.svelte'
  import Card from "@/components/Card.svelte"
  import { getBrowserLocale } from '@/ui'
  import { mdiClockPlusOutline, mdiDeleteClock, mdiWebClock } from '@mdi/js'
  import { onDestroy, onMount } from 'svelte';
  import { log } from '@/logger'
  import { repeatEvery } from '@/time/utils'
  import { clickOutside } from '@/actions/click-outside'

  const UPDATE_TIME = 60 * 1000 // every minute

  type WorldClock = {
    name: string;
    timeZone: string;
  }

  let open: boolean = $state(false)
  let inputTimezone: string = $state('')
  let inputName: string = $state('')
  let browserLocale: string = $state('en-us')
  let cancelTick = $state<() => void>()
  let tickUpdate = $state(false)

  let clocks: WorldClock[] = $state([]);

  onMount(() => {
    browserLocale = getBrowserLocale();
    const stored = localStorage.getItem('worldClocks');
    if (stored) {
      clocks = JSON.parse(stored) as WorldClock[];
    }
  })

  onDestroy(() => {
    cancelTick?.()
  })

  function startClockTick() {
    cancelTick = repeatEvery(() => {
      log('updating clocks')
      // force rerendering of clock indicating key change
      tickUpdate = !tickUpdate
    }, UPDATE_TIME)
  }

  function toggleDisplay() {
    if (open) {
      open = false
      cancelTick?.()
    } else {
      open = true
      startClockTick()
    }
  }

  function addClock(name: string, timeZone: string) {
    clocks = [...clocks, { name, timeZone }];
    localStorage.setItem('worldClocks', JSON.stringify(clocks));
  }

  function deleteClock(index: number) {
    clocks = clocks.filter((_, i) => i !== index);
    localStorage.setItem('worldClocks', JSON.stringify(clocks));
  }
</script>

<div class="relative" use:clickOutside={() => open = false}>
  <button onclick={toggleDisplay}>
    <Icon class="text-white cursor-pointer" path={mdiWebClock} size={48}  />
  </button>
  {#if open}
    <Card class="absolute right-0">
      <h2 class="text-lg mb-3">World Clocks 🌎</h2>
      {#key tickUpdate}
        {#each clocks as clock, i}
          <div class="flex flex-row items-center justify-between gap-2">
            <div class="flex flex-col">
              <h1 class="text-2xl font-bold">{new Date().toLocaleString(browserLocale, { timeStyle: 'short', timeZone: clock.timeZone })}</h1>
              <h2 class="text-sm text-zinc-100">{clock.name}</h2>
            </div>
            <button onclick={() => deleteClock(i)}>
              <Icon path={mdiDeleteClock} size={24} class="cursor-pointer"  />
            </button>
          </div>
        {/each}
      {/key}
      <form class="mt-5 flex flex-col gap-1" onsubmit={(e) => {
        e.preventDefault();
        addClock(inputName, inputTimezone);
        inputName = '';
        inputTimezone = '';
      }}>
        <label for="timezone">Timezone</label>
        <select class="text-black p-2 rounded" required bind:value={inputTimezone}>
          <option value="" disabled selected>Select timezone</option>
          {#each Intl.supportedValuesOf('timeZone') as timezone}
            <option value={timezone}>{timezone}</option>
          {/each}
        </select>
        <label for="name">Name</label>
        <input class="text-black p-2 rounded" placeholder="World Clock Name" required type="text" bind:value={inputName} />
        <button class="flex items-center justify-center gap-1 mt-2 py-1 px-3 bg-slate-800 hover:bg-slate-500 rounded" type="submit">
          <Icon size={16} path={mdiClockPlusOutline} /> Add Clock
        </button>
      </form>
    </Card>
  {/if}
</div>