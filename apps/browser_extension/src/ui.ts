import browser from 'webextension-polyfill'
import { NAME_STORAGE_KEY } from './constants'

export async function retrieveUsername(): Promise<string | undefined> {
  let { [NAME_STORAGE_KEY]: name } = (await browser.storage.sync.get(
    NAME_STORAGE_KEY
  )) as { name: string }

  return name
}

export async function storeUsername(name: string): Promise<void> {
  await browser.storage.sync.set({ [NAME_STORAGE_KEY]: name })
}

export function getWelcomeMessage(name: string): string {
  const hours = new Date().getHours()
  let momentOfDay: string

  if (hours < 12) {
    momentOfDay = 'morning'
  } else if (hours < 18) {
    momentOfDay = 'afternoon'
  } else {
    momentOfDay = 'evening'
  }

  return `Good ${momentOfDay}, ${name}`
}
