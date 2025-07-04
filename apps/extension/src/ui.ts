import browser from 'webextension-polyfill'
import { NAME_STORAGE_KEY } from './constants'
import { log } from '@/logger'

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

export async function updateBackgroundImage(url: string, callback?: () => void): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onerror = (error) => {
      log(`error loading background image: ${url}`, error)
      reject(new Error(`Failed to load background image: ${url}`))
    }
    image.onload = () => {
      log(`background image loaded: ${url}`)
      callback?.()
      const elem = document.querySelector(':root') as HTMLElement
      elem?.style.setProperty('--background-image', `url(${url})`)
      resolve()
    }
    image.src = url
    log(`background image loaded in browser: ${url}`)
  })
}
