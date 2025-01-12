import browser from 'webextension-polyfill'
import { NAME_STORAGE_KEY } from './constants'

export function getBrowserLocale(): string {
  if (navigator.languages !== undefined) return navigator.languages[0]
  return navigator.language
}

export async function retrieveUsername(): Promise<string | null> {
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

export function getTime(): string {
  const locale = getBrowserLocale()
  const date = new Date()
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Returns a string representing how much of the day has passed in percentage form.
 *
 * @returns A string such as "50%" indicating the percentage of the day that has passed.
 */
export function getTimePercentage(): string {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  // 1440 minutes in a day
  return `${Math.round(((hours * 60 + minutes) / 1440) * 100)}%`
}
