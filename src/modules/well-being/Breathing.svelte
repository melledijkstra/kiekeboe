<script lang="ts">
  import { Timer } from "@/time/timer"
  import { onDestroy, onMount } from "svelte"
  import { millisecondsToTime } from "@/time/utils"
  import { fade } from "svelte/transition"
  import { log } from "@/logger"

  const DURATION = 5 * 60 * 1000

  let breatheState = $state<boolean>(true) // true: inhale, false: exhale
  let active = $state(false)
  let timer = $state(new Timer({
    duration: DURATION
  }))
  let timeLeft = $state(millisecondsToTime(DURATION))
  let counter = $state(1)

  function onTick(remainingTime: number) {
    log('tick', {
      breatheState,
      counter
    })

    if (
      (!breatheState && counter >= 7) || // exhale for 7 ticks (seconds)
      (breatheState && counter >= 6) // inhale for 5 ticks (seconds)
    ) {
      breatheState = !breatheState
      counter = 1
    } else {
      counter++
    }

    timeLeft = millisecondsToTime(remainingTime)
  }

  function start() {
    active = true
    timer.start()
  }

  function pause() {
    active = false
    breatheState = true
    counter = 1
    timer.pause()
  }

  onMount(() => {
    timer.on('tick', onTick)
  })

  onDestroy(() => {
    timer.stop()
  })
</script>

<div class="flex flex-col gap justify-center items-center">
  <button onclick={!active ? start : pause}>
    <div
      class={{
        'overflow-hidden border-2 border-white/20 bg-white/20 p-5 text-white shadow-md backdrop-blur-sm': true,
        'flex flex-col items-center justify-center size-60 m-10 text-3xl transition-all duration-1000 text-center rounded-full capitalize': true,
        'scale-150': active && breatheState
      }}>
      {#if active}
        <span transition:fade>{breatheState ? 'Inhale' : 'Exhale'}</span>
      {/if}
      <span>{timeLeft}</span>
    </div>
  </button>
</div>
