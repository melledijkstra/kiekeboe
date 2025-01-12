<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { getTime, getTimePercentage } from "./ui"
  import { log } from "./logger"
  import { repeatEvery } from "./time/utils"
  
  const ONE_MINUTE = 60 * 1000 // in ms

  type ClockMode = 'percentage' | 'time'

  const CLOCK_STORAGE_KEY = 'clockMode'

  let time = $state()
  let mode = $state<ClockMode>()
  let cancelTick = $state<() => void>()

  function getDisplayTime() {
    return mode === 'time' ? getTime() : getTimePercentage()
  }

  function toggleMode() {
    mode = mode === 'percentage' ? 'time' : 'percentage'
    localStorage.setItem(CLOCK_STORAGE_KEY, mode)
    time = getDisplayTime()
  }

  function startClock() {
    // run the clock 1 time when executed, then update every second
    time = getDisplayTime()
    cancelTick =  repeatEvery(() => {
      time = getDisplayTime()
    }, ONE_MINUTE)
  }

  onMount(async () => {
    const clockMode = localStorage.getItem(CLOCK_STORAGE_KEY) as ClockMode
    log({
      clockMode
    })
    mode = clockMode ?? 'time'
    startClock()
  });

  onDestroy(() => {
    cancelTick?.()
  })
</script>

<button
  onclick={toggleMode}
  class="empty:min-h-32 time text-white text-9xl drop-shadow-xl cursor-pointer">{time}</button>
