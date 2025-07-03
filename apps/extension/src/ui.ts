import browser from 'webextension-polyfill'
import { NAME_STORAGE_KEY } from './constants'
import { cacheImage } from '@/cache/messages'

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

export async function updateBackgroundImage(
  url: string,
  callback?: () => void,
) {
  let src = url
  try {
    const cached = await cacheImage.send(url)
    if (cached) {
      src = cached
    }
  } catch (err) {
    console.error('Failed to retrieve cached image', err)
  }

  const image = new Image()
  image.src = src
  image.onload = () => {
    callback?.()
    const elem = document.querySelector(':root') as HTMLElement
    elem?.style.setProperty('--background-image', `url(${src})`)
  }
}
