<script lang="ts">
  import { mdiSpa } from "@mdi/js"
  import Icon from "../../components/Icon.svelte"
  import { Timer } from "./timer"
  import { log } from "../../logger"

  const props = $props()

  let timer = $state<Timer | null>(null)
  let breathingActive = $state(false)
  let duration = 1000 * 60 * 1 // 5 minutes
  let remainingTime = $state<string>('')
  let color = $state('text-white')

  function startTimer() {
    if (timer) {
      timer.stop()
    }

    timer = new Timer({
      duration,
      interval: 1000, // update everything just under 1 second
      onStart: (remainingTimeMs) => {
        remainingTime = Timer.formatRemainingTime(remainingTimeMs)
      },
      onStop: () => {
        breathingActive = false
        remainingTime = ''
        color = 'text-white'
      },
      onTick: (remainingTimeMs) => {
        const seconds = Math.floor(remainingTimeMs / 1000)
        log(seconds)
        if (seconds % 12 === 0) {
          log('Breath out!')
          color = 'text-amber-400'
        } else if (seconds % 6 === 0) {
          log('Breath in!')
          color = 'text-white'
        }

        remainingTime = Timer.formatRemainingTime(remainingTimeMs)
      }
    })

    timer.start()
  }

  function toggleBreathing() {
    if (props.onclick?.()) {
      return
    }
    if (breathingActive) {
      breathingActive = false
      timer?.stop()
    } else {
      breathingActive = true
      startTimer()
    }
  }
</script>

<button onclick={toggleBreathing} class="size-12 m-5 transition-colors duration-1000 {color} cursor-pointer">
  <Icon class={breathingActive ? 'animate-pulse' : ''} size={48} path={mdiSpa} />
  {#if breathingActive}
    <span>{remainingTime}</span>
  {/if}
</button>
