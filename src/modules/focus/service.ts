import browser from 'webextension-polyfill'
import type { BackgroundService } from '@/background'
import { logger } from '@/background'
import {
  getPomodoroState,
  pomodoroComplete,
  startPomodoro,
  stateUpdate,
  stopPomodoro,
  switchMode
} from '@/modules/focus/messages'
import { Timer } from '@/time/timer'
import type { Mode, PomodoroState } from './types'

const WORK_DURATION = 25 * 60 * 1000
const BREAK_DURATION = 65 * 1000 // 5 * 60 * 1000

const browserAction = browser.action ?? browser.browserAction

export class FocusService implements BackgroundService {
  private state: PomodoroState = {
    isRunning: false,
    mode: 'work',
    duration: WORK_DURATION,
    timeRemaining: WORK_DURATION
  }
  private timer: Timer

  constructor() {
    logger.log('Pomodoro service initialized')
    this.timer = new Timer({
      duration: this.state.duration,
      onTick: this.onTick.bind(this),
      onComplete: this.onComplete.bind(this)
    })
    startPomodoro.on(this.startPomodoro.bind(this))
    stopPomodoro.on(this.stopPomodoro.bind(this))
    getPomodoroState.on(this.getPomodoroState.bind(this))
    switchMode.on(this.switchMode.bind(this))
  }

  onTick(remainingTime: number) {
    const currentMin = Math.floor(this.state.timeRemaining / (60 * 1000))
    const newMin = Math.floor(remainingTime / (60 * 1000))
    // update when minutes pass, or when we are under one minute
    if (currentMin !== newMin || newMin < 1) {
      const badgeText =
        newMin < 1
          ? this.timer.formatRemainingSeconds()
          : this.timer.formatRemainingMinutes()
      browserAction.setBadgeText({ text: badgeText })
    }
    this.state.timeRemaining = remainingTime
    this.sendUpdate()
  }

  onComplete() {
    logger.log('Pomodoro completed in background service')
    browserAction.setBadgeText({ text: null })
    browser.notifications.create('pomodoroDone', {
      type: 'basic',
      title: `Pomodoro Done (${this.state.mode})`,
      message: `Pomodoro timer done for: ${this.state.mode}`,
      iconUrl: browser.runtime.getURL('icons/bell.png')
    })
    pomodoroComplete.send()
    this.state.isRunning = false
    this.switchMode(this.state.mode === 'work' ? 'break' : 'work')
  }

  sendUpdate() {
    stateUpdate.send(this.state)
  }

  startPomodoro() {
    logger.log('Pomodoro started in background service')
    logger.log(browser.action, browser.browserAction)
    browserAction.setBadgeText({
      text: this.timer.formatRemainingMinutes()
    })
    this.timer.start()
    this.state.isRunning = true
    this.sendUpdate()
  }

  stopPomodoro() {
    logger.log('Pomodoro stopped in background service')
    this.timer.stop()
    this.state.isRunning = false
    this.state.timeRemaining = this.state.duration
    browserAction.setBadgeText({ text: null })
    this.sendUpdate()
  }

  switchMode(mode: Mode) {
    logger.log(`Pomodoro mode switched in background service: ${mode}`)
    this.state.mode = mode
    const duration = mode === 'break' ? BREAK_DURATION : WORK_DURATION
    this.timer.setDuration(duration)
    this.state.isRunning = false
    browserAction.setBadgeText({ text: null })
    this.state.duration = duration
    this.state.timeRemaining = duration
    this.sendUpdate()
    return true
  }

  getPomodoroState(): PomodoroState {
    return this.state
  }
}
