export type TimerState = {
  isRunning: boolean
  duration: number
  timeRemaining: number
}

export type ChronometerState = {
  isRunning: boolean
  elapsed: number
}

export type AlarmState = {
  alarmTime: number | null
  triggered: boolean
}
