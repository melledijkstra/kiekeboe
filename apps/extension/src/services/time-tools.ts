import browser from 'webextension-polyfill'
import { Timer } from '@/time/timer'
import type { BackgroundService } from '@/services/types'
import {
  startTimer,
  stopTimer,
  getTimerState,
  timerStateUpdate,
  startChronometer,
  stopChronometer,
  getChronometerState,
  chronometerStateUpdate,
  setAlarm,
  clearAlarm,
  getAlarmState,
  alarmTriggered,
  alarmStateUpdate
} from '@/modules/time-tools/messages'
import type { TimerState, ChronometerState, AlarmState } from '@/modules/time-tools/types'
import { logger } from '@/background.entry'

export class TimeToolsService implements BackgroundService {
  private timer = new Timer({ duration: 0 })
  private chronometer = new Timer({ duration: Infinity, interval: 1000 })
  private timerState: TimerState = { isRunning: false, duration: 0, timeRemaining: 0 }
  private chronometerState: ChronometerState = { isRunning: false, elapsed: 0 }
  private alarmState: AlarmState = { alarmTime: null, triggered: false }
  private alarmTimeout: number | null = null

  constructor() {
    logger.log('TimeTools service initialized')
    this.timer.on('tick', this.onTimerTick.bind(this))
    this.timer.on('complete', this.onTimerComplete.bind(this))
    this.chronometer.on('tick', this.onChronometerTick.bind(this))

    startTimer.on(this.startTimer.bind(this))
    stopTimer.on(this.stopTimer.bind(this))
    getTimerState.on(this.getTimerState.bind(this))

    startChronometer.on(this.startChronometer.bind(this))
    stopChronometer.on(this.stopChronometer.bind(this))
    getChronometerState.on(this.getChronometerState.bind(this))

    setAlarm.on(this.setAlarm.bind(this))
    clearAlarm.on(this.clearAlarm.bind(this))
    getAlarmState.on(this.getAlarmState.bind(this))
  }

  private onTimerTick(remaining: number) {
    this.timerState.timeRemaining = remaining
    timerStateUpdate.send(this.timerState)
  }

  private onTimerComplete() {
    this.timerState.isRunning = false
    this.timerState.timeRemaining = 0
    timerStateUpdate.send(this.timerState)
    browser.notifications.create('timeToolsTimer', {
      type: 'basic',
      title: 'Timer done',
      message: 'The timer has finished',
      iconUrl: browser.runtime.getURL('icons/bell.png')
    })
  }

  private onChronometerTick() {
    this.chronometerState.elapsed += 1000
    chronometerStateUpdate.send(this.chronometerState)
  }

  private setAlarm(time: number) {
    if (this.alarmTimeout) {
      clearTimeout(this.alarmTimeout)
    }
    this.alarmState = { alarmTime: time, triggered: false }
    const delay = Math.max(time - Date.now(), 0)
    this.alarmTimeout = setTimeout(() => this.fireAlarm(), delay)
    alarmStateUpdate.send(this.alarmState)
  }

  private clearAlarm() {
    if (this.alarmTimeout) {
      clearTimeout(this.alarmTimeout)
      this.alarmTimeout = null
    }
    this.alarmState = { alarmTime: null, triggered: false }
    alarmStateUpdate.send(this.alarmState)
  }

  private fireAlarm() {
    this.alarmTimeout = null
    this.alarmState.triggered = true
    alarmStateUpdate.send(this.alarmState)
    alarmTriggered.send()
    browser.notifications.create('timeToolsAlarm', {
      type: 'basic',
      title: 'Alarm',
      message: 'Your alarm is going off',
      iconUrl: browser.runtime.getURL('icons/bell.png')
    })
  }

  private startTimer(duration: number) {
    this.timer.setDuration(duration)
    this.timer.start()
    this.timerState = { isRunning: true, duration, timeRemaining: duration }
    timerStateUpdate.send(this.timerState)
  }

  private stopTimer() {
    this.timer.stop()
    this.timerState.isRunning = false
    this.timerState.timeRemaining = this.timerState.duration
    timerStateUpdate.send(this.timerState)
  }

  private startChronometer() {
    this.chronometerState = { isRunning: true, elapsed: 0 }
    this.chronometer.start()
    chronometerStateUpdate.send(this.chronometerState)
  }

  private stopChronometer() {
    this.chronometer.stop()
    this.chronometerState.isRunning = false
    chronometerStateUpdate.send(this.chronometerState)
  }

  private getTimerState(): TimerState {
    return this.timerState
  }

  private getChronometerState(): ChronometerState {
    return this.chronometerState
  }

  private getAlarmState(): AlarmState {
    return this.alarmState
  }
}
