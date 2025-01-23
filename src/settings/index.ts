import browser from 'webextension-polyfill'
import type { ModuleID } from '@/modules'

export type Settings = {
  modules: {
    [key in ModuleID]: boolean
  }
}

export const DEFAULT_MODULE_SETTINGS: { [key in ModuleID]: boolean } = {
  command_center: true,
  well_being: true,
  world_clocks: true,
  metrics: true,
  pomodoro: true,
  countdown: true,
  weather: false,
  google_tasks: false,
  spotify: false
}

export const SETTINGS_KEY = 'settings' as const
export const DEFAULT_SETTINGS: Settings = {
  modules: DEFAULT_MODULE_SETTINGS
}

export function saveSettings(settings: Settings) {
  browser.storage.sync.set({ settings })
}

export async function getSettings(): Promise<Settings> {
  const { settings: storageSettings } = (await browser.storage.sync.get(
    SETTINGS_KEY
  )) as { settings: Settings }

  if (storageSettings) {
    return storageSettings
  }

  return DEFAULT_SETTINGS
}
