import browser from 'webextension-polyfill'
import { Timer } from '@/time/timer'
import type { BackgroundService } from '@/services/types'
import {
  startTimer,
  stopTimer,
  getTimerState,
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
import type { ChronometerState, AlarmState } from '@/modules/time-tools/types'
import { logger } from '@/background.entry'
import { TimerToolService } from '@/modules/time-tools/tools/TimerToolService'

export class TimeToolsService implements BackgroundService {
  private timerTool = new TimerToolService()
  // Keep chronometer and alarm logic as before for now
  private chronometer = new Timer({ duration: Infinity, interval: 1000 })
  private chronometerState = { isRunning: false, elapsed: 0 }
  private alarmState: AlarmState = { alarmTime: null, triggered: false }
  private alarmTimeout: NodeJS.Timeout | null = null

  constructor() {
    this.initialize()
  }

  async initialize(): Promise<void> {
    logger.log('TimeTools service initialized')
    // Timer events are now handled by TimerToolService
    startTimer.on((duration) => this.timerTool.start(duration))
    stopTimer.on(() => this.timerTool.stop())
    getTimerState.on(() => this.timerTool.getState())
    // TODO: Use a generic message/event handler for state updates

    // Chronometer and alarm logic remains as before
    this.chronometer.on('tick', this.onChronometerTick.bind(this))
    startChronometer.on(this.startChronometer.bind(this))
    stopChronometer.on(this.stopChronometer.bind(this))
    getChronometerState.on(this.getChronometerState.bind(this))
    setAlarm.on(this.setAlarm.bind(this))
    clearAlarm.on(this.clearAlarm.bind(this))
    getAlarmState.on(this.getAlarmState.bind(this))
  }

  destroy(): void {
    throw new Error('Method not implemented.')
  }

  // --- Timer logic is now handled by timerTool ---
  // private onTimerTick(remaining: number) { ... }
  // private onTimerComplete() { ... }
  // private startTimer(duration: number) { ... }
  // private stopTimer() { ... }
  // private getTimerState(): TimerState { ... }

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

  private getChronometerState(): ChronometerState {
    return this.chronometerState
  }

  private getAlarmState(): AlarmState {
    return this.alarmState
  }
}
