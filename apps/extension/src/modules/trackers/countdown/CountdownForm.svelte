<script lang="ts">
  import Icon from '@/components/Icon.svelte'
  import Panel from '@/components/Panel.svelte'
  import {
    mdiCalendarOutline,
    mdiCalendarPlusOutline,
    mdiDelete
  } from '@mdi/js'
  import { clickOutside } from '@/actions/click-outside'
  import IconButton from '@/components/IconButton.svelte'
  import Toggle from '@/components/Toggle.svelte'
  import { trackers, type Counter } from '../state.svelte'
  import { calculateDays } from '@/time/utils'

  const props = $props()

  let open: boolean = $state(false)
  let inputName = $state('')
  let inputDate = $state(getToday())
  let inputPinned = $state(false)

  function getToday(): string {
    return new Date().toISOString()?.split('T')[0]
  }

  function toggleDisplay() {
    open = !open
  }

  function addCountdown(name: string, date: string, pinned: boolean) {
    const countdownDate = new Date(date)
    const newCounter: Counter = { name, value: countdownDate.valueOf(), pinned }
    trackers.storeCounters([
      ...trackers.counters,
      newCounter
    ])
  }

  function deleteCountdown(index: number) {
    const newCounters = trackers.counters.filter((_, i) => i !== index)
    trackers.storeCounters(newCounters)
  }
</script>

<div class="relative {props.class}" use:clickOutside={() => (open = false)}>
  <IconButton
    tooltip={!open ? 'Countdown' : ''}
    onclick={toggleDisplay}
    icon={mdiCalendarOutline}
  />
  {#if open}
    <Panel class="absolute right-0">
      <h2 class="text-lg mb-3">Countdowns 🗓️</h2>
      {#each trackers.counters as countdown, i}
        <div class="flex flex-row items-center justify-between gap-2">
          <div class="flex flex-col">
            <h1 class="text-2xl font-bold">{calculateDays(countdown.value)}d</h1>
            <h2 class="text-sm text-zinc-100">{countdown.name}</h2>
          </div>
          <button onclick={() => deleteCountdown(i)} class="cursor-pointer">
            <Icon path={mdiDelete} size={24} />
          </button>
        </div>
      {/each}
      <form
        class="mt-5 flex flex-col gap-1"
        onsubmit={(e) => {
          e.preventDefault()
          addCountdown(inputName, inputDate, inputPinned)
          inputName = ''
          inputDate = getToday()
          inputPinned = false
        }}
      >
        <label for="timezone">Timezone</label>
        <input
          type="date"
          class="text-black p-2 rounded-sm"
          required
          bind:value={inputDate}
        />
        <label for="name">Name</label>
        <input
          class="text-black p-2 rounded-sm"
          placeholder="Countdown Name"
          required
          type="text"
          bind:value={inputName}
        />
        <Toggle bind:checked={inputPinned} label="Pin?" />
        <button
          class="flex items-center justify-center gap-1 mt-2 py-1 px-3 bg-slate-800 hover:bg-slate-500 rounded-sm"
          type="submit"
        >
          <Icon size={16} path={mdiCalendarPlusOutline} /> Add Countdown
        </button>
      </form>
    </Panel>
  {/if}
</div>
