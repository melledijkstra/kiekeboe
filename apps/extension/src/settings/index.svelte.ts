import browser, { type Storage } from 'webextension-polyfill'
import type { ModuleID } from '@/modules'
import { Logger } from '@/logger'
import type { ILogger } from '@/interfaces/logger.interface'
import { writable,  } from 'svelte/store'

let changeListenersSet = false

export type SettingsState = {
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

export const DEFAULT_SETTINGS: SettingsState = {
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

export const settingsStore = writable<SettingsState>(DEFAULT_SETTINGS)

export class Settings implements ILogger {
  logger = new Logger('settings')
  private settingsCopy: SettingsState = DEFAULT_SETTINGS
  private _loading = false
  private _unsub?: () => void

  get state() {
    return settingsStore
  }

  constructor() {
    this._unsub = settingsStore.subscribe((value) => {
      this.logger.log('Settings store updated', value)
      this.settingsCopy = value
    })
  }

  public async initialize() {
    this.logger.log('Initializing settings state')
    await this.syncSettingsStoreWithStorage()
  }

  public destroy() {
    this.removeSettingsChangeListener()
    this._unsub?.()
  }

  async syncSettingsStoreWithStorage() {
    this.logger.log('syncing settings store with storage', this._loading)
    if (this._loading) {
      this.logger.log('Settings store is already loading, skipping sync')
      return
    }

    this._loading = true

    const { settings: storageSettings } = (await browser.storage.sync.get(
      SETTINGS_KEY
    )) as { settings: Settings }
    
    this.logger.log('syncing settings store with storage', {
      storageSettings
    })

    // this.#state = Object.assign(this.#state, storageSettings, { loaded: true })
    settingsStore.set({
      ...DEFAULT_SETTINGS,
      ...storageSettings,
      loaded: true
    })

    if (!changeListenersSet) {
      browser.storage.sync.onChanged.addListener((changes) => this.onStorageSettingsChanged(changes))
      changeListenersSet = true
    }

    this._loading = false
  }

  async getSettingsFromStorage(): Promise<SettingsState> {
    const { settings: storageSettings } = (await browser.storage.sync.get(
      SETTINGS_KEY
    )) as { settings: SettingsState }

    return { ...DEFAULT_SETTINGS, ...storageSettings, loaded: true }
  }

  async saveSettingsToStorage() {
    // make sure we don't save the loaded property to storage
    const settingsToStore = structuredClone(this.settingsCopy)
    delete settingsToStore.loaded
    this.logger.log('Saving settings to storage', {
      settingsToStore
    })
    await browser.storage.sync.set({ settings: settingsToStore })
  }

  removeSettingsChangeListener() {
    browser.storage.onChanged.removeListener((changes) => this.onStorageSettingsChanged(changes))
  }
  
  onStorageSettingsChanged = (
    changes: Storage.StorageAreaOnChangedChangesType
  ) => {
    if (!changes[SETTINGS_KEY]) {
      return
    }

    const newSettings = changes[SETTINGS_KEY].newValue as SettingsState
    this.logger.log('onStorageSettingsChanged: settings changed, updating in memory', {
      newSettings
    })

    settingsStore.update((current) => ({
      ...current,
      ...newSettings,
      loaded: true // ensure loaded is set to true
    }))
  }
}

export const settings = new Settings()
