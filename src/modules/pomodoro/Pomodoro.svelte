<script lang="ts">
  import browser from 'webextension-polyfill'
  import { Timer } from '@/time/timer'
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import {
    getPomodoroState,
    pomodoroComplete,
    startPomodoro,
    stateUpdate,
    stopPomodoro,
    switchMode as switchPomodoroMode
  } from './messages'
  import type { PomodoroState } from './types'
  import { resetTitle, setTitle } from '@/app-state.svelte'

  let pState = $state<PomodoroState>({
    mode: 'work',
    timeRemaining: 0,
    duration: 0,
    isRunning: false
  })
  let audio = $state<HTMLAudioElement>(new Audio())
  let timeLeft = $derived(Timer.formatRemainingTime(pState.timeRemaining))

  $effect(() => {
    if (pState.isRunning) {
      setTitle(
        `${Timer.formatRemainingTime(pState.timeRemaining)} - ${pState.mode}`
      )
    } else {
      resetTitle()
    }
  })

  function onStateUpdate(state: PomodoroState) {
    pState = state
  }

  function start() {
    startPomodoro.send()
  }

  function stop() {
    stopPomodoro.send()
  }

  function onComplete() {
    audio.play()
  }

  function switchMode() {
    if (pState.mode === 'work') {
      switchPomodoroMode.send('break')
    } else {
      switchPomodoroMode.send('work')
    }
  }

  onMount(async () => {
    audio.src = browser.runtime.getURL('audio/happy-bell.wav')
    pState = await getPomodoroState.send()
    stateUpdate.on(onStateUpdate)
    pomodoroComplete.on(onComplete)
  })
</script>

<div class="flex flex-col gap justify-center items-center">
  <div
    class={{
      'overflow-hidden border-2 border-white/20 bg-white/20 p-5 text-white shadow-md backdrop-blur-xs': true,
      'flex flex-col items-center justify-center size-60 m-10 text-3xl transition-all duration-1000 text-center rounded-full capitalize': true
    }}
  >
    <span class="capitalize" transition:fade>{pState.mode}</span>
    <span>{timeLeft}</span>
  </div>
  <div class="flex flex-row gap-2 mt-2">
    <button
      onclick={pState.isRunning ? stop : start}
      class="text-white px-3 py-1 bg-gray-500 hover:bg-gray-400 rounded-lg"
      >{pState.isRunning ? 'Stop' : 'Start'}</button
    >
    <button
      onclick={switchMode}
      class="text-white px-3 py-1 bg-gray-500 hover:bg-gray-400 rounded-lg"
      >{pState.mode === 'work' ? 'Break' : 'Work'}</button
    >
  </div>
</div>
