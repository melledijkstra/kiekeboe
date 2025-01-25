<script lang="ts">
  import Icon from '@/components/Icon.svelte'
  import Card from "@/components/Card.svelte"
  import { mdiCalendarOutline, mdiCalendarPlusOutline, mdiDelete } from '@mdi/js'
  import { onMount } from 'svelte'
  import { clickOutside } from '@/actions/click-outside'
  import ModeButton from '@/components/ModeButton.svelte'

  const STORAGE_KEY = 'counters'

  const props = $props()

  type Counter = {
    name: string
    date: number
  }

  let open: boolean = $state(false)
  let counters: Counter[] = $state([])
  let inputName = $state('')
  let inputDate = $state(getToday())

  function getToday(): string {
    return (new Date()).toISOString()?.split('T')[0]
  }

  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      counters = JSON.parse(stored) as Counter[];
    }
  })

  function toggleDisplay() {
    open = !open
  }

  function addCountdown(name: string, date: string) {
    const countdownDate = new Date(date)
    counters = [...counters, { name, date: countdownDate.valueOf() }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
  }

  function deleteCountdown(index: number) {
    counters = counters.filter((_, i) => i !== index);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
  }

  function calculateDays(timestamp: number) {
    const a = new Date()
    const b = new Date(timestamp)
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
</script>

<div class="relative {props.class}" use:clickOutside={() => open = false}>
  <ModeButton onclick={toggleDisplay} icon={mdiCalendarOutline} />
  {#if open}
    <Card class="absolute right-0">
      <h2 class="text-lg mb-3">Countdowns 🗓️</h2>
      {#each counters as countdown, i}
        <div class="flex flex-row items-center justify-between gap-2">
          <div class="flex flex-col">
            <h1 class="text-2xl font-bold">{calculateDays(countdown.date)}d</h1>
            <h2 class="text-sm text-zinc-100">{countdown.name}</h2>
          </div>
          <button onclick={() => deleteCountdown(i)} class="cursor-pointer">
            <Icon path={mdiDelete} size={24}  />
          </button>
        </div>
      {/each}
      <form class="mt-5 flex flex-col gap-1" onsubmit={(e) => {
        e.preventDefault();
        addCountdown(inputName, inputDate);
        inputName = '';
        inputDate = getToday();
      }}>
        <label for="timezone">Timezone</label>
        <input type="date" class="text-black p-2 rounded" required bind:value={inputDate}>
        <label for="name">Name</label>
        <input class="text-black p-2 rounded" placeholder="Countdown Name" required type="text" bind:value={inputName} />
        <button class="flex items-center justify-center gap-1 mt-2 py-1 px-3 bg-slate-800 hover:bg-slate-500 rounded" type="submit">
          <Icon size={16} path={mdiCalendarPlusOutline} /> Add Countdown
        </button>
      </form>
    </Card>
  {/if}
</div>