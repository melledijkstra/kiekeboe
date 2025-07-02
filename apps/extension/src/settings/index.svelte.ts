import browser, { type Storage } from 'webextension-polyfill'
import type { ModuleID } from '@/modules'
import { Logger } from '@/logger'
import type { ILogger } from '@/interfaces/logger.interface'

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

export class Settings implements ILogger {
  logger = new Logger('settings')
  private _loading = false
  private _state = $state<SettingsState>(DEFAULT_SETTINGS)

  public async initialize() {
    await this.syncSettingsStoreWithStorage()
  }

  public destroy() {
    this.removeSettingsChangeListener()
  }

  public get state() {
    return this._state
  }

  async syncSettingsStoreWithStorage() {
    this.logger.log('syncing settings store with storage', this._loading)
    if (this._loading) {
      this.logger.log('Settings store already loaded, skipping sync')
      return
    }

    this._loading = true

    const { settings: storageSettings } = (await browser.storage.sync.get(
      SETTINGS_KEY
    )) as { settings: Settings }

    const settings = { ...DEFAULT_SETTINGS, ...storageSettings, loaded: true }
    
    this.logger.log('syncing settings store with storage', {
      settings
    })

    this._state = settings

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
    const settingsToStore = $state.snapshot(this._state)
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
    this.logger.log('Settings changed in storage, updating', {
      ...newSettings
    })

    this._state = {
      ...this._state,
      ...newSettings,
      loaded: true // ensure loaded is set to true
    }
  }
}

export const settings = new Settings()
