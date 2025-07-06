import browser from 'webextension-polyfill'
import { NAME_STORAGE_KEY } from './constants'
import { Logger } from '@/logger'

const logger = new Logger('ui')

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

async function fetchImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve(image.src)
    }
    image.onerror = (err) => {
      logger.error('Failed to load image', err)
      reject(err)
    }
    image.src = src
  });
}

function setSrc(src: string) {
  const elem = document.querySelector(':root') as HTMLElement

  if (!elem) {
    logger.error('Root element not found for setting background image')
    return
  }

  elem.style.setProperty('--background-image', `url(${src})`)
}

export async function setBackgroundImage(url: string) {
  const src = await fetchImage(url)
  setSrc(src)
}
