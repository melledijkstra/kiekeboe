export type Counter = {
  name: string
  value: number
  pinned: boolean
}

export type CountDown = {
  name: string
  date: number
  pinned: boolean
}

export type WorldClock = {
  name: string
  timeZone: string
  pinned: boolean
}

const STORAGE_KEYS = {
  counters: 'counters',
  countdowns: 'countdowns',
  worldClocks: 'worldClocks'
} as const

class Trackers {
  counters = $state<Counter[]>([])
  countdowns = $state<CountDown[]>([])
  worldClocks = $state<WorldClock[]>([])

  constructor() {
    this.loadCounters()
    this.loadCountdowns()
    this.loadClocks()
  }

  public setCountdowns(countdowns: CountDown[]) {
    this.storeCountdowns(countdowns)
    this.countdowns = countdowns
  }

  public setCounters(counters: Counter[]) {
    this.storeCounters(counters)
    this.counters = counters
  }

  public setWorldClocks(worldClocks: WorldClock[]) {
    this.storeWorldClocks(worldClocks)
    this.worldClocks = worldClocks
  }

  storeCountdowns(counters: CountDown[]) {
    localStorage.setItem(STORAGE_KEYS.countdowns, JSON.stringify(counters))
  }

  storeCounters(counters: Counter[]) {
    localStorage.setItem(STORAGE_KEYS.counters, JSON.stringify(counters))
  }

  storeWorldClocks(worldClocks: WorldClock[]) {
    localStorage.setItem(STORAGE_KEYS.worldClocks, JSON.stringify(worldClocks))
  }

  private loadCounters() {
    const stored = localStorage.getItem(STORAGE_KEYS.counters)
    try {
      if (stored) {
        this.counters = JSON.parse(stored) as Counter[]
      }
    } catch(ignored) {}
  }

  private loadCountdowns() {
    const stored = localStorage.getItem(STORAGE_KEYS.countdowns)
    try {
      if (stored) {
        this.countdowns = JSON.parse(stored) as CountDown[]
      }
    } catch(ignored) {}
  }

  private loadClocks() {
    const stored = localStorage.getItem(STORAGE_KEYS.worldClocks)
    try {
      if (stored) {
        this.worldClocks = JSON.parse(stored) as WorldClock[]
      }
    } catch(ignored) {}
  }
}

export const trackers = new Trackers()
