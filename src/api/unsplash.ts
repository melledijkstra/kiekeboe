import {
  DAILY_IMAGE_KEY,
  NEXT_IMAGE_KEY,
  UNSPLASH_PROXY_URL
} from '@/constants'
import browser from 'webextension-polyfill'
import { formatDate } from '@/date'
import { log } from '@/logger'
import type { UnsplashResponse } from '@/api/definitions/unsplash'

type ImageInfo = {
  id: string
  url: string
  date?: string
}

export class UnsplashClient {
  constructor() {}

  async fetchRandomUnsplashImage(): Promise<UnsplashResponse> {
    const response = await fetch(UNSPLASH_PROXY_URL, {
      headers: {
        'X-Extension-ID': browser.runtime.id
      }
    })

    return (await response.json()) as UnsplashResponse
  }

  async retrieveNextImage(): Promise<ImageInfo> {
    // and fetch a new next image
    const response = await this.fetchRandomUnsplashImage()
    const nextDailyImage: ImageInfo = {
      id: response.id,
      url: response.urls.full
    }

    await browser.storage.local.set({
      [NEXT_IMAGE_KEY]: nextDailyImage
    })

    return nextDailyImage
  }

  async getDailyImage(): Promise<string | null> {
    const {
      [DAILY_IMAGE_KEY]: storageImage,
      [NEXT_IMAGE_KEY]: storageNextImage
    } = (await browser.storage.local.get([
      DAILY_IMAGE_KEY,
      NEXT_IMAGE_KEY
    ])) as {
      [DAILY_IMAGE_KEY]: ImageInfo | undefined
      [NEXT_IMAGE_KEY]: ImageInfo | undefined
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
        this.retrieveNextImage()

        return storageNextImage.url
      } else {
        log('no next image neither, fetching a new one')
        this.retrieveNextImage()
      }

      const data = await this.fetchRandomUnsplashImage()
      const dailyImage: ImageInfo = {
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

  async refreshDailyImage(): Promise<string | null> {
    await browser.storage.local.remove(DAILY_IMAGE_KEY)
    return await this.getDailyImage()
  }

  loadImage(url: string, callback?: () => void) {
    const image = new Image()
    image.src = url
    image.onload = () => {
      callback?.()
      document.body.style.backgroundImage = `url(${url})`
    }
  }
}
