import browser from 'webextension-polyfill'
import { DEFAULT_MODULE_SETTINGS } from '@/modules'
import type { Module } from '@/modules'

export type Settings = {
  modules: {
    [key in Module]: boolean
  }
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
