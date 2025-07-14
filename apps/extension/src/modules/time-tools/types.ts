// Unified state type for all time tools
export type TimeToolState =
  | { type: 'timer'; isRunning: boolean; duration: number; timeRemaining: number }
  | { type: 'chronometer'; isRunning: boolean; elapsed: number }
  | { type: 'alarm'; alarmTime: number | null; triggered: boolean }

export type TimeToolType = TimeToolState['type']

/** @deprecated use TimeToolState instead */
export type TimerState = {
  isRunning: boolean
  duration: number
  timeRemaining: number
}

/** @deprecated use TimeToolState instead */
export type ChronometerState = {
  isRunning: boolean
  elapsed: number
}

/** @deprecated use TimeToolState instead */
export type AlarmState = {
  alarmTime: number | null
  triggered: boolean
}
