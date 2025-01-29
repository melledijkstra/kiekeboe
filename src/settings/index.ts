import browser, { type Storage } from 'webextension-polyfill'
import { writable } from 'svelte/store'
import type { ModuleID } from '@/modules'
import { Logger } from '@/logger'

const logger = new Logger('settings')

let changeListenersSet = false

export type Settings = {
  modules: {
    [key in ModuleID]: boolean
  }
}

const SETTINGS_KEY = 'settings' as const

const DEFAULT_MODULE_SETTINGS: { [key in ModuleID]: boolean } = {
  command_center: false,
  well_being: false,
  world_clocks: false,
  fitbit: false,
  pomodoro: false,
  countdown: false,
  weather: false,
  google_tasks: false,
  spotify: false
}

export const DEFAULT_SETTINGS: Settings = {
  modules: DEFAULT_MODULE_SETTINGS
}

export const settingsStore = writable<Settings>(DEFAULT_SETTINGS)

export function saveSettingsToStorage(settings: Settings) {
  logger.log('Saving settings to storage', {
    settings
  })
  browser.storage.sync.set({ settings })
}

export async function getSettingsFromStorage(): Promise<Settings> {
  const { settings: storageSettings } = (await browser.storage.sync.get(
    SETTINGS_KEY
  )) as { settings: Settings }

  return { ...DEFAULT_SETTINGS, ...storageSettings }
}

const onStorageSettingsChanged = (
  changes: Storage.StorageAreaOnChangedChangesType
) => {
  if (!changes[SETTINGS_KEY]) {
    return
  }

  const newSettings = changes[SETTINGS_KEY].newValue as Settings
  logger.log('Settings changed in storage, updating', {
    ...newSettings
  })
  settingsStore.update((current) => ({
    ...current,
    ...newSettings
  }))
}

export async function syncSettingsStoreWithStorage() {
  const { settings: storageSettings } = (await browser.storage.sync.get(
    SETTINGS_KEY
  )) as { settings: Settings }

  logger.log('syncing settings store with storage', {
    storageSettings
  })
  settingsStore.set({ ...DEFAULT_SETTINGS, ...storageSettings })

  if (!changeListenersSet) {
    browser.storage.sync.onChanged.addListener(onStorageSettingsChanged)
  }
}

export function removeSettingsChangeListener() {
  browser.storage.onChanged.removeListener(onStorageSettingsChanged)
}
