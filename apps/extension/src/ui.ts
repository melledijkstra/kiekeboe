import browser from 'webextension-polyfill'
import { NAME_STORAGE_KEY } from './constants'

export async function retrieveUsername(): Promise<string | undefined> {
  const { [NAME_STORAGE_KEY]: name } = (await browser.storage.sync.get(
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

export function updateBackgroundImage(url: string, callback?: () => void) {
  const image = new Image()
  image.src = url
  image.onload = () => {
    callback?.()
    const elem = document.querySelector(':root') as HTMLElement
    elem?.style.setProperty('--background-image', `url(${url})`)
  }
}
