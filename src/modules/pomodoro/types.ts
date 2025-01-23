export type Mode = 'work' | 'break'

export type PomodoroState = {
  mode: Mode
  isRunning: boolean
  timeRemaining: number // in ms
  duration: number // in ms
}
