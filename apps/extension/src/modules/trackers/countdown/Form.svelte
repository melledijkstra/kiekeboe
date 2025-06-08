<script lang="ts">
  import Icon from '@/components/Icon.svelte'
  import Panel from '@/components/Panel.svelte'
  import Toggle from '@/components/atoms/Toggle.svelte'
  import { trackers, type CountDown, type Counter } from '../state.svelte'
  import { calculateDays } from '@/time/utils'
  import { mdiCalendarPlusOutline, mdiDelete } from '@mdi/js'

  let inputName = $state('')
  let inputDate = $state(getToday())
  let inputPinned = $state(false)

  function getToday(): string {
    return new Date().toISOString()?.split('T')[0]
  }

  function addCountdown(name: string, date: string, pinned: boolean) {
    const countdownDate = new Date(date)
    const newCountdown: CountDown = { name, date: countdownDate.valueOf(), pinned }
    trackers.storeCountdowns([
      ...trackers.countdowns,
      newCountdown
    ])
  }

  function deleteCountdown(index: number) {
    const newCountdowns = trackers.countdowns.filter((_, i) => i !== index)
    trackers.storeCountdowns(newCountdowns)
  }
</script>

<Panel class="absolute right-0">
  <h2 class="text-lg mb-3">Countdowns 🗓️</h2>
  {#each trackers.countdowns as countdown, i}
    <div class="flex flex-row items-center justify-between gap-2">
      <div class="flex flex-col">
        <h1 class="text-2xl font-bold">{calculateDays(countdown.date)}d</h1>
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
    <label for="date">Date</label>
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