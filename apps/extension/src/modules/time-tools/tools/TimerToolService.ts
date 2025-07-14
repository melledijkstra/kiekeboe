import { BaseTimeToolService } from './BaseTimeToolService'
import { Timer } from '@/time/timer'
import type { TimeToolState } from '../types'
import browser from 'webextension-polyfill'

export class TimerToolService extends BaseTimeToolService<Extract<TimeToolState, { type: 'timer' }>> {
  constructor() {
    super(
      new Timer({ duration: 0 }),
      { type: 'timer', isRunning: false, duration: 0, timeRemaining: 0 }
    )
  }

  protected wireEvents(): void {
    this.timer.on('tick', (remaining) => {
      this.state.timeRemaining = remaining
      this.sendStateUpdate()
    })
    this.timer.on('complete', () => {
      this.state.isRunning = false
      this.state.timeRemaining = 0
      this.sendStateUpdate()
      browser.notifications.create('timeToolsTimer', {
        type: 'basic',
        title: 'Timer done',
        message: 'The timer has finished',
        iconUrl: browser.runtime.getURL('icons/bell.png')
      })
    })
  }

  start(duration: number): void {
    this.timer.setDuration(duration)
    this.timer.start()
    this.state.isRunning = true
    this.state.duration = duration
    this.state.timeRemaining = duration
    this.sendStateUpdate()
  }

  stop(): void {
    this.timer.stop()
    this.state.isRunning = false
    this.state.timeRemaining = this.state.duration
    this.sendStateUpdate()
  }

  getState() {
    return this.state
  }

  private sendStateUpdate() {
    // Placeholder for generic event/message handler
    // e.g., this.messageHandler?.('timerStateUpdate', this.state)
  }
} 