import browser from 'webextension-polyfill'
import { DAILY_IMAGE_KEY, NEXT_IMAGE_KEY } from '@/constants'
import { log, Logger } from '@/logger'

export type ImageInfo = {
  id: string
  url: string
  date?: string
}

export class ImageCache {
  private logger = new Logger('ImageCache')

  async getDailyImageInfo(): Promise<ImageInfo | undefined> {
    const { [DAILY_IMAGE_KEY]: storedImage } = (await browser.storage.local.get(
      DAILY_IMAGE_KEY
    )) as { [DAILY_IMAGE_KEY]?: ImageInfo }
    return storedImage
  }

  async setDailyImageInfo(info: ImageInfo): Promise<void> {
    await browser.storage.local.set({ [DAILY_IMAGE_KEY]: info })
    this.logger.log('stored daily image', info)
  }

  async getNextImageInfo(): Promise<ImageInfo | undefined> {
    const { [NEXT_IMAGE_KEY]: storedNext } = (await browser.storage.local.get(
      NEXT_IMAGE_KEY
    )) as { [NEXT_IMAGE_KEY]?: ImageInfo }
    return storedNext
  }

  async setNextImageInfo(info: ImageInfo): Promise<void> {
    await browser.storage.local.set({ [NEXT_IMAGE_KEY]: info })
    this.logger.log('stored next image', info)
  }

  async clearDailyImage(): Promise<void> {
    await browser.storage.local.remove(DAILY_IMAGE_KEY)
    this.logger.log('Daily image cleared from storage')
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
