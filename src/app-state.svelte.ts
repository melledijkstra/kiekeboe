import { DEFAULT_SETTINGS, type Settings } from './settings'

export type AppState = {
  settings: Settings
  ui: {
    subtitle: string
  }
}

export const appState = $state({
  settings: DEFAULT_SETTINGS
})
