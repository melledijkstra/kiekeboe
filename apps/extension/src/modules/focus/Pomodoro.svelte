<script lang="ts">
  import browser from 'webextension-polyfill'
  import { Timer } from '@/time/timer'
  import { onMount } from 'svelte'
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
  import Panel from '@/components/atoms/Panel.svelte'

  type Props = {
    onMinutePassed: () => void
  }

  const { onMinutePassed } = $props()

  let pState = $state<PomodoroState>({
    mode: 'work',
    timeRemaining: 0,
    duration: 0,
    isRunning: false
  })
  let seconds = $state(0)
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
    // pState.timeRemaining is in milliseconds
    const durationMinutes = Math.floor(state.duration / 60000)
    const oldMinutes = Math.floor(pState.timeRemaining / 60000)
    const newMinutes = Math.floor(state.timeRemaining / 60000)
    console.log(oldMinutes, newMinutes)
    if (oldMinutes !== durationMinutes && oldMinutes > newMinutes) {
      onMinutePassed()
    }
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
  <Panel class="text-2xl">
    <span class="capitalize">{pState.mode}</span>
    <span>{timeLeft}</span>
  </Panel>
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
