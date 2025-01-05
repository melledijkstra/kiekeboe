<script lang="ts">
  import { onMount } from "svelte"
  import { getTime, getTimePercentage } from "./ui"
  import { log } from "./logger"
  
  type ClockMode = 'percentage' | 'time'

  const CLOCK_STORAGE_KEY = 'clockMode'

  let time = $state()
  let mode = $state<ClockMode>()

  function getDisplayTime() {
    return mode === 'time' ? getTime() : getTimePercentage()
  }

  function toggleMode() {
    mode = mode === 'percentage' ? 'time' : 'percentage'
    localStorage.setItem(CLOCK_STORAGE_KEY, mode)
    time = getDisplayTime()
  }

  function startClock() {
    setInterval(() => {
      time = getDisplayTime()
    }, 1000);
  }

  onMount(async () => {
    const clockMode = localStorage.getItem(CLOCK_STORAGE_KEY) as ClockMode
    log({
      clockMode
    })
    mode = clockMode ?? 'time'
    startClock()
  });
</script>

<h1
  onclick={toggleMode}
  class="empty:min-h-32 time text-white text-9xl drop-shadow-xl cursor-pointer">{time}</h1>
