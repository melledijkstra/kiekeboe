import type { WeatherInfo } from "./api/weather"

const STORAGE_KEY = 'appMode'

export const appModes = ['default', 'breathing', 'pomodoro'] as const

export type AppMode = (typeof appModes)[number]

export type AppState = {
  mode: AppMode
  weather?: WeatherInfo
}

export const appState = $state<AppState>({
  mode: (localStorage.getItem(STORAGE_KEY) as AppMode) ?? 'default'
})

export function switchAppMode(mode: AppMode) {
  appState.mode = mode
  localStorage.setItem(STORAGE_KEY, mode)
}
