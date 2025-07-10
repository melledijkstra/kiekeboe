import type { LocationInfo } from './api/geolocation'
import type { WeatherInfo } from './api/weather'

const STORAGE_KEY = 'appMode'

export const appModes = ['default', 'breathing', 'focus'] as const

export type AppMode = (typeof appModes)[number]

export type AppState = {
  mode: AppMode
  title: string
  weather?: WeatherInfo
  geolocation?: LocationInfo
}

export const appState = $state<AppState>({
  mode: (localStorage.getItem(STORAGE_KEY) as AppMode) ?? 'default',
  title: 'New Tab'
})

export function switchAppMode(mode: AppMode) {
  appState.mode = mode
  localStorage.setItem(STORAGE_KEY, mode)
}

export function setTitle(title: string) {
  appState.title = title
}

export function resetTitle() {
  appState.title = 'New Tab'
}
