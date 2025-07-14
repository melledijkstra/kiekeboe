<script lang="ts">
  import { mdiAlarm, mdiTimerOutline, mdiClockOutline } from '@mdi/js'
  import IconButton from '@/components/atoms/IconButton.svelte'
  import Button from '@/components/atoms/Button.svelte'
  import Input from '@/components/atoms/Input.svelte'
  import { onMount } from 'svelte'
  import {
    startTimer,
    stopTimer,
    timerStateUpdate,
    getTimerState,
    startChronometer,
    stopChronometer,
    chronometerStateUpdate,
    getChronometerState,
    setAlarm,
    clearAlarm,
    getAlarmState,
    alarmStateUpdate,
    alarmTriggered
  } from './messages'
  import type { TimerState, ChronometerState, AlarmState } from './types'
  import { Timer } from '@/time/timer'
  import { formatSeconds } from '@/time/utils'
  import { Popover } from 'bits-ui'
  import PopPanel from '@/components/atoms/PopPanel.svelte'
  import Icon from '@/components/atoms/Icon.svelte'

  let timerMinutes = $state(1)
  let timerState = $state<TimerState>({ isRunning: false, duration: 0, timeRemaining: 0 })
  let chronometerState = $state<ChronometerState>({ isRunning: false, elapsed: 0 })
  let alarmInput = $state('')
  let alarmState = $state<AlarmState>({ alarmTime: null, triggered: false })

  function startStopTimer() {
    if (timerState.isRunning) {
      stopTimer.send()
    } else {
      startTimer.send(timerMinutes * 60 * 1000)
    }
  }

  function startStopChrono() {
    if (chronometerState.isRunning) {
      stopChronometer.send()
    } else {
      startChronometer.send()
    }
  }

  function setAlarmTime() {
    if (alarmInput) {
      const [h, m] = alarmInput.split(':').map(Number)
      const now = new Date()
      const alarm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m)
      if (alarm.getTime() < now.getTime()) {
        alarm.setDate(alarm.getDate() + 1)
      }
      setAlarm.send(alarm.getTime())
    }
  }

  function clearAlarmTime() {
    clearAlarm.send()
  }

  function timerUpdate(state: TimerState) {
    Object.assign(timerState, state)
  }

  onMount(async () => {
    timerState = await getTimerState.send()
    chronometerState = await getChronometerState.send()
    alarmState = await getAlarmState.send()
    timerStateUpdate.on(timerUpdate)
    chronometerStateUpdate.on((s) => Object.assign(chronometerState, s))
    alarmStateUpdate.on((s) => Object.assign(alarmState, s))
    alarmTriggered.on(() => {
      alert('Alarm!')
    })
  })
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <IconButton icon={mdiTimerOutline} {...props} />
    {/snippet}
  </Popover.Trigger>
  <PopPanel panelProps={{ size: 'medium' }}>
    <div>
      <h2 class="font-bold mb-1 flex items-center gap-1"><Icon path={mdiTimerOutline} /> Timer</h2>
      <Input type="number" min="1" bind:value={timerMinutes} class="mb-2" />
      <Button onclick={startStopTimer}>{timerState.isRunning ? 'Stop' : 'Start'}</Button>
      <p class="mt-1">{Timer.formatRemainingTime(timerState.timeRemaining)}</p>
    </div>
    <hr />
    <div>
      <h2 class="font-bold mb-1 flex items-center gap-1"><Icon path={mdiClockOutline} /> Chronometer</h2>
      <Button onclick={startStopChrono}>{chronometerState.isRunning ? 'Stop' : 'Start'}</Button>
      <p class="mt-1">{formatSeconds(Math.floor(chronometerState.elapsed / 1000))}</p>
    </div>
    <hr />
    <div>
      <h2 class="font-bold mb-1 flex items-center gap-1"><Icon path={mdiAlarm} /> Alarm</h2>
      <Input type="time" bind:value={alarmInput} class="mb-2" />
      <div class="flex gap-2">
        <Button onclick={setAlarmTime}>Set</Button>
        <Button onclick={clearAlarmTime}>Clear</Button>
      </div>
      {#if alarmState.alarmTime}
        <p class="mt-1">Alarm set for {new Date(alarmState.alarmTime).toLocaleTimeString()}</p>
      {/if}
      {#if alarmState.triggered}
        <p class="mt-1 text-red-500">Alarm triggered!</p>
      {/if}
    </div>
  </PopPanel>
</Popover.Root>
