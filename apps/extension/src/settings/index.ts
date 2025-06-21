import browser, { type Storage } from 'webextension-polyfill'
import { writable } from 'svelte/store'
import type { ModuleID } from '@/modules'
import { Logger } from '@/logger'

const logger = new Logger('settings')

let changeListenersSet = false

export type Settings = {
  loaded?: boolean
  network: {
    serverlessHost: string
    databaseUri: string
  },
  modules: {
    [key in ModuleID]: boolean
  }
  ui: {
    dailyImageQuery?: string
    showCurrentTask: boolean
  }
}

const SETTINGS_KEY = 'settings' as const

const DEFAULT_MODULE_SETTINGS: { [key in ModuleID]: boolean } = {
  command_center: false,
  well_being: false,
  focus: false,
  weather: false,
  google_tasks: false,
  notes: false,
  spotify: false
}

export const DEFAULT_SETTINGS: Settings = {
  loaded: false,
  network: {
    serverlessHost: '',
    databaseUri: ''
  },
  modules: DEFAULT_MODULE_SETTINGS,
  ui: {
    showCurrentTask: false
  }
}

export const settingsStore = writable<Settings>(DEFAULT_SETTINGS)

export function saveSettingsToStorage(settings: Settings) {
  // make sure we don't save the loaded property to storage
  const settingsToStore = structuredClone(settings)
  delete settingsToStore.loaded
  logger.log('Saving settings to storage', {
    settingsToStore
  })
  browser.storage.sync.set({ settings: settingsToStore })
}

export async function getSettingsFromStorage(): Promise<Settings> {
  const { settings: storageSettings } = (await browser.storage.sync.get(
    SETTINGS_KEY
  )) as { settings: Settings }

  return { ...DEFAULT_SETTINGS, ...storageSettings, loaded: true }
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

  const settings = { ...DEFAULT_SETTINGS, ...storageSettings, loaded: true }
  
  logger.log('syncing settings store with storage', {
    settings
  })

  settingsStore.set(settings)

  if (!changeListenersSet) {
    browser.storage.sync.onChanged.addListener(onStorageSettingsChanged)
  }
}

export function removeSettingsChangeListener() {
  browser.storage.onChanged.removeListener(onStorageSettingsChanged)
}
