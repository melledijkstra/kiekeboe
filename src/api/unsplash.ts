import {
  DAILY_IMAGE_KEY,
  NEXT_IMAGE_KEY,
  UNSPLASH_PROXY_URL
} from '@/constants'
import browser from 'webextension-polyfill'
import { formatDate } from '@/date'
import { log } from '@/logger'
import type { UnsplashResponse } from '@/api/definitions/unsplash'

type Image = {
  id: string
  url: string
  date?: string
}

async function fetchRandomUnsplashImage(): Promise<UnsplashResponse> {
  const response = await fetch(UNSPLASH_PROXY_URL, {
    headers: {
      'X-Extension-ID': browser.runtime.id
    }
  })

  return (await response.json()) as UnsplashResponse
}

async function retrieveNextImage(): Promise<Image> {
  // and fetch a new next image
  const data = await fetchRandomUnsplashImage()
  const nextDailyImage: Image = {
    id: data.id,
    url: data.urls.full
  }

  await browser.storage.local.set({
    [NEXT_IMAGE_KEY]: nextDailyImage
  })

  return nextDailyImage
}

export async function getDailyImage(): Promise<string | null> {
  const {
    [DAILY_IMAGE_KEY]: storageImage,
    [NEXT_IMAGE_KEY]: storageNextImage
  } = (await browser.storage.local.get([DAILY_IMAGE_KEY, NEXT_IMAGE_KEY])) as {
    [DAILY_IMAGE_KEY]: Image | undefined
    [NEXT_IMAGE_KEY]: Image | undefined
  }

  log({
    storageImage,
    storageNextImage
  })

  const today = formatDate(new Date())

  if (storageImage && storageImage?.date === today) {
    log('retrieved daily image from cache')
    return storageImage.url
  }

  log('no daily image in cache, trying to retrieve next one')

  try {
    // no image in cache, see if we already retrieved next and use that one instead
    if (storageNextImage) {
      log('next image exists, use that one instead')
      // swap the next image to be the current image
      await browser.storage.local.set({
        [DAILY_IMAGE_KEY]: {
          ...storageNextImage,
          date: today
        }
      })

      // make sure we retrieve a next image again
      retrieveNextImage()

      return storageNextImage.url
    } else {
      log('no next image neither, fetching a new one')
      retrieveNextImage()
    }

    const data = await fetchRandomUnsplashImage()
    const dailyImage: Image = {
      id: data.id,
      date: today,
      url: data.urls.full
    }

    log('retrieved response, storing in cache', dailyImage.url)

    await browser.storage.local.set({
      [DAILY_IMAGE_KEY]: dailyImage
    })

    return dailyImage.url
  } catch (error) {
    console.error('Error fetching image:', error)
    return null
  }
}

export async function refreshDailyImage(): Promise<string | null> {
  await browser.storage.local.remove(DAILY_IMAGE_KEY)
  return await getDailyImage()
}

export function loadImage(url: string, callback?: () => void): void {
  const image = new Image()
  image.src = url
  image.onload = () => {
    callback?.()
    document.body.style.backgroundImage = `url(${url})`
  }
}
