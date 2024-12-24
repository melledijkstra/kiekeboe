import { DEFAULT_SETTINGS, type Settings } from './settings'

export type AppState = {
  settings: Settings
}

export const appState = $state({
  settings: DEFAULT_SETTINGS
})
