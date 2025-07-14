import { Timer } from '@/time/timer'
import type { TimeToolState } from '../types'

export abstract class BaseTimeToolService<T extends TimeToolState> {
  protected timer: Timer
  protected state: T

  constructor(timer: Timer, initialState: T) {
    this.timer = timer
    this.state = initialState
    this.wireEvents()
  }

  protected abstract wireEvents(): void

  abstract start(...args: unknown[]): void
  abstract stop(): void
  abstract getState(): T
} 