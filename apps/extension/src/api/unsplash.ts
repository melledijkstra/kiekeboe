import { SERVERLESS_HOST_URL } from '@/constants'
import browser from 'webextension-polyfill'
import { addDays, formatDate } from '@/date'
import { log, Logger } from '@/logger'
import type { UnsplashResponse } from '@/api/definitions/unsplash'
import type { ILogger } from '@/interfaces/logger.interface'
import { ImageCache, type ImageInfo } from './image-cache'

const ENDPOINT = '/api/daily-image'


export class UnsplashClient implements ILogger {
  public logger: Logger = new Logger('UnsplashClient')
  private HOST: string
  public query?: string
  private cache: ImageCache

  constructor(host: string = SERVERLESS_HOST_URL, query?: string) {
    this.HOST = host ?? SERVERLESS_HOST_URL
    this.logger.log('UnsplashClient initialized with host:', this.HOST)
    this.query = query
    this.cache = new ImageCache()
  }

  get host(): string {
    return this.HOST
  }

  setHost(host: string) {
    if (!host || host.trim() === '') {
      throw new Error('Serverless host domain cannot be empty')
    }
    this.HOST = host
  }

  async fetchUnsplashImage(): Promise<UnsplashResponse> {
    this.logger.log('Fetching Unsplash image from', {
      host: this.HOST,
      endpoint: ENDPOINT,
      query: this.query
    })
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
    const response = await this.fetchUnsplashImage()
    const tomorrow = addDays(new Date(), 1)
    const next: ImageInfo = {
      id: response.id,
      url: response.urls.full,
      date: formatDate(tomorrow)
    }

    await this.cache.setNextImageInfo(next)
    return next
  }

  async getDailyImage(): Promise<string | undefined> {
    const today = formatDate(new Date())
    const cached = await this.cache.getDailyImageInfo()

    if (cached && cached.date === today) {
      log('retrieved daily image from cache')
      return cached.url
    }

    const next = await this.cache.getNextImageInfo()
    if (next) {
      log('next image exists, use that one instead')
      await this.cache.setDailyImageInfo({ ...next, date: today })
      await this.cache.clearNextImage()
      this.retrieveNextImage()
      return next.url
    }

    this.logger.log('no cached image found, fetching new one')
    const data = await this.fetchUnsplashImage()
    const daily: ImageInfo = { id: data.id, url: data.urls.full, date: today }
    await this.cache.setDailyImageInfo(daily)
    this.retrieveNextImage()
    return daily.url
  }

  async refreshDailyImage(): Promise<string | undefined> {
    await this.cache.clearDailyImage()
    return this.getDailyImage()
  }

  clearNextImage() {
    return this.cache.clearNextImage()
  }

  clearImageCache() {
    return this.cache.clearImageCache()
  }
}
