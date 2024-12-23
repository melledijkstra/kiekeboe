import { NAME_STORAGE_KEY } from './constants'

function getBrowserLocale(): string {
  if (navigator.languages !== undefined) return navigator.languages[0]
  return navigator.language
}

export async function retrieveUsername(): Promise<string | null> {
  let { [NAME_STORAGE_KEY]: name } = await chrome.storage.local.get(
    NAME_STORAGE_KEY
  )

  return name
}

export async function storeUsername(name: string): Promise<void> {
  await chrome.storage.local.set({ [NAME_STORAGE_KEY]: name })
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
