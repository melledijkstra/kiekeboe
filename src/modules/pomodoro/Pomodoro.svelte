
<script lang="ts">
  import browser from 'webextension-polyfill'
  import { Timer } from "@/time/timer"
  import { onDestroy, onMount } from "svelte"
  import { fade } from "svelte/transition"

  type Mode = 'work' | 'break'

  const WORK_DURATION = 25 * 60 * 1000
  const BREAK_DURATION = 5 * 60 * 1000

  let pomodoroMode = $state<Mode>('work')
  let active = $state(false)
  let audio = $state<HTMLAudioElement>(new Audio())
  let timer = $state(new Timer({
    duration: WORK_DURATION
  }));
  let timeLeft = $state(Timer.formatRemainingTime(WORK_DURATION))

  function onTick(remainingTime: number) {
    timeLeft = timer.formatRemainingTime()
  }

  function start() {
    active = true
    timer.start()
  }

  function pause() {
    active = false
    pomodoroMode = 'work'
    timer.pause()
  }

  function stop() {
    timer.stop()
    active = false
    timeLeft = timer.formatRemainingTime()
  }

  function onComplete() {
    browser.notifications.create('pomodoroDone', {
      type: 'basic',
      title: `Pomodoro Done (${pomodoroMode})`,
      message: `Pomodoro timer done for: ${pomodoroMode}`,
      iconUrl: browser.runtime.getURL('icons/bell.png'),
    })
    audio.play()
    switchMode()
    active = false
  }

  function switchMode() {
    if (pomodoroMode === 'work') {
      pomodoroMode = 'break'
      timer.setDuration(BREAK_DURATION)
      timeLeft = timer.formatRemainingTime()
    } else {
      pomodoroMode = 'work'
      timer.setDuration(WORK_DURATION)
      timeLeft = timer.formatRemainingTime()
    }
  }

  onMount(() => {
    audio.src = browser.runtime.getURL('audio/happy-bell.wav')
    timer.on('tick', onTick)
    timer.on('complete', onComplete)
  });

  onDestroy(() => {
    timer.stop()
  });
</script>

<div class="flex flex-col gap justify-center items-center">
  <div
    class={{
      'overflow-hidden border-2 border-white/20 bg-white/20 p-5 text-white shadow-md backdrop-blur-sm': true,
      'flex flex-col items-center justify-center size-60 m-10 text-3xl transition-all duration-1000 text-center rounded-full capitalize': true,
    }}>
    <span class="capitalize" transition:fade>{pomodoroMode}</span>
    <span>{timeLeft}</span>
  </div>
  <div class="flex flex-row gap-2 mt-2">
    <button onclick={active ? pause : start} class="text-white px-3 py-1 bg-gray-500 hover:bg-gray-400 rounded-lg">{active ? 'Pause' : 'Start'}</button>
    <button onclick={stop} class="text-white px-3 py-1 bg-gray-500 hover:bg-gray-400 rounded-lg">Stop</button>
    <button onclick={switchMode} class="text-white px-3 py-1 bg-gray-500 hover:bg-gray-400 rounded-lg">{pomodoroMode === 'work' ? 'Break' : 'Work'}</button>
  </div>
</div>