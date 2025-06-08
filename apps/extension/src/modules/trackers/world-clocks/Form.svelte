<script lang="ts">
  import Icon from '@/components/Icon.svelte'
  import Panel from '@/components/Panel.svelte'
  import Toggle from '@/components/atoms/Toggle.svelte'
  import { mdiClockPlusOutline, mdiDeleteClock } from '@mdi/js'
  import { renderTimezone, repeatEvery } from '@/time/utils'
  import { trackers } from '../state.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { log } from '@/logger'

  const UPDATE_TIME = 60 * 1000 // every minute

  let cancelTick = $state<() => void>()
  let tickUpdate = $state(false)
  let inputTimezone: string = $state('')
  let inputName: string = $state('')
  let inputPinned: boolean = $state(false)

  function addClock(name: string, timeZone: string, pinned: boolean) {
    const newClocks = [...trackers.worldClocks, { name, timeZone, pinned }]
    trackers.storeWorldClocks(newClocks)
  }

  function deleteClock(index: number) {
    const newClocks = trackers.worldClocks.filter((_, i) => i !== index)
    trackers.storeWorldClocks(newClocks)
  }

  function startClockTick() {
    cancelTick = repeatEvery(() => {
      log('updating clocks')
      // force rerendering of clock indicating key change
      tickUpdate = !tickUpdate
    }, UPDATE_TIME)
  }

  onDestroy(() => {
    cancelTick?.()
  })

  onMount(() => {
    startClockTick()
  })
</script>

<Panel class="absolute right-0">
  <h2 class="text-lg mb-3">World Clocks 🌎</h2>
  {#key tickUpdate}
    {#each trackers.worldClocks as clock, i}
      <div class="flex flex-row items-center justify-between gap-2">
        <div class="flex flex-col">
          <h1 class="text-2xl font-bold">
            {renderTimezone(clock.timeZone)}
          </h1>
          <h2 class="text-sm text-zinc-100">{clock.name}</h2>
        </div>
        <button onclick={() => deleteClock(i)} class="cursor-pointer">
          <Icon path={mdiDeleteClock} size={24} />
        </button>
      </div>
    {/each}
  {/key}
  <form
    class="mt-5 flex flex-col gap-1"
    onsubmit={(e) => {
      e.preventDefault()
      addClock(inputName, inputTimezone, inputPinned)
      inputName = ''
      inputTimezone = ''
      inputPinned = false
    }}
  >
    <label for="timezone">Timezone</label>
    <select
      class="text-black p-2 rounded-sm"
      required
      bind:value={inputTimezone}
    >
      <option value="" disabled selected>Select timezone</option>
      {#each Intl.supportedValuesOf('timeZone') as timezone}
        <option value={timezone}>{timezone}</option>
      {/each}
    </select>
    <label for="name">Name</label>
    <input
      class="text-black p-2 rounded-sm"
      placeholder="World Clock Name"
      required
      type="text"
      bind:value={inputName}
    />
    <Toggle bind:checked={inputPinned} label="Pin?" />
    <button
      class="flex items-center justify-center gap-1 mt-2 py-1 px-3 bg-slate-800 hover:bg-slate-500 rounded-sm"
      type="submit"
    >
      <Icon size={16} path={mdiClockPlusOutline} /> Add Clock
    </button>
  </form>
</Panel>