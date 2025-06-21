import {
  DAILY_IMAGE_KEY,
  NEXT_IMAGE_KEY,
  SERVERLESS_HOST_URL
} from '@/constants'
import browser from 'webextension-polyfill'
import { formatDate } from '@/date'
import { log } from '@/logger'
import type { UnsplashResponse } from '@/api/definitions/unsplash'

const ENDPOINT = '/api/daily-image'

type ImageInfo = {
  id: string
  url: string
  date?: string
}

export class UnsplashClient {
  private HOST: string
  public query?: string

  constructor(host: string = SERVERLESS_HOST_URL, query?: string) {
    this.HOST = host
    this.query = query
    log('UnsplashClient initialized with host:', this.HOST, 'and query:', this.query) 
  }

  setHost(host: string) {
    this.HOST = host
  }

  async fetchUnsplashImage(): Promise<UnsplashResponse> {
    const serverlessUrl = new URL(ENDPOINT, this.HOST)
    
    if (this.query) {
      serverlessUrl.searchParams.set('query', this.query)
    }

    const response = await fetch(serverlessUrl, {
      headers: {
        'X-Extension-ID': browser.runtime.id
      }
    })

    return (await response.json()) as UnsplashResponse
  }

  async retrieveNextImage(): Promise<ImageInfo> {
    // and fetch a new next image
    const response = await this.fetchUnsplashImage()
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

      const data = await this.fetchUnsplashImage()
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
      const elem = document.querySelector(':root') as HTMLElement
      elem?.style.setProperty('--background-image', `url(${url})`)
    }
  }

  async clearNextImage() {
    await browser.storage.local.remove(NEXT_IMAGE_KEY)
    log('Next image cleared from storage')
  }

  async clearImageCache() {
    await browser.storage.local.remove([DAILY_IMAGE_KEY, NEXT_IMAGE_KEY])
    log('Daily and next images cleared from storage')
  }
}
