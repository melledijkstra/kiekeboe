import { writable } from 'svelte/store'
import { Logger } from '@/logger'

const logger = new Logger('background-store')

function fetchImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image.src)
    image.onerror = (err) => {
      logger.error('Failed to load image', err)
      reject(err)
    }
    image.src = src
  })
}

const { subscribe, set } = writable<string | undefined>(undefined)

export const backgroundImage = { subscribe }

export async function setBackgroundImage(url: string) {
  const src = await fetchImage(url)
  set(src)
}
