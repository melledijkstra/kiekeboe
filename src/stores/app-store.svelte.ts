import { DEFAULT_SETTINGS, type Settings } from '../settings'

export type AppStore = {
  settings: Settings
}

export const appStore = $state<AppStore>({
  settings: DEFAULT_SETTINGS
})
