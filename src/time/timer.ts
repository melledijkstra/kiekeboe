export type TimerCallback = (remainingTime: number) => void

export type TimerOptions = {
  duration: number // Duration of the timer in milliseconds
  onTick?: TimerCallback // Callback for each tick
  onStart?: TimerCallback
  onStop?: TimerCallback
  onComplete?: TimerCallback // Callback when the timer completes
  interval?: number // Interval for tick updates in milliseconds (default: 1000ms)
}

export type TimerEvent = 'tick' | 'start' | 'stop' | 'complete'

export class Timer {
  private duration: number
  private interval: number
  private onTick?: TimerCallback
  private onStart?: TimerCallback
  private onStop?: TimerCallback
  private onComplete?: TimerCallback
  private timerId: number | null = null
  private startTime: number = 0
  private remainingTime: number = 0

  constructor(options: TimerOptions) {
    this.duration = options.duration
    this.interval = options.interval ?? 1000
    this.onTick = options.onTick
    this.onStart = options.onStart
    this.onStop = options.onStop
    this.onComplete = options.onComplete
    this.remainingTime = this.duration
  }

  start() {
    if (this.timerId) {
      return // timer is already running
    }

    if (this.onStart) {
      this.onStart(this.remainingTime)
    }

    this.startTime = Date.now()
    this.remainingTime = this.duration
    this.timerId = setTimeout(() => this.runTick(), this.interval - 5)
  }

  // self adjusting timer, read the below article to understand why
  // @link https://www.sitepoint.com/creating-accurate-timers-in-javascript/
  private runTick() {
    const currentTime = Date.now()
    const elapsedTime = currentTime - this.startTime
    this.remainingTime = Math.max(this.duration - elapsedTime, 0)

    if (this.onTick) {
      this.onTick(this.remainingTime)
    }

    if (this.remainingTime <= 0) {
      this.stop()
      if (this.onComplete) {
        this.onComplete(0)
      }
    } else {
      const elapsedTime = currentTime - this.startTime
      const drift = elapsedTime % this.interval
      const delay = this.interval - drift
      this.timerId = setTimeout(() => this.runTick(), delay)
    }
  }

  static formatRemainingTime(milliseconds: number) {
    const seconds = Math.ceil(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  on(event: TimerEvent, callback: TimerCallback) {
    switch (event) {
      case 'start':
        this.onStart = callback
        break
      case 'stop':
        this.onStop = callback
        break
      case 'tick':
        this.onTick = callback
        break
      case 'complete':
        this.onComplete = callback
        break
    }
  }

  stop() {
    if (this.timerId) {
      if (this.onStop) {
        this.onStop(this.remainingTime)
      }
      clearTimeout(this.timerId)
      this.timerId = null
    }
  }

  reset(newDuration?: number) {
    this.stop()
    this.duration = newDuration ?? this.duration
    this.remainingTime = this.duration
  }

  pause() {
    this.stop()
    // save the remaining time for resumption
    this.duration = this.remainingTime
  }

  resume() {
    this.start()
  }
}
