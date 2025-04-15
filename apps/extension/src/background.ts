import browser from 'webextension-polyfill'
import { FocusService } from '@/modules/focus/service'
import { Logger } from './logger'

export const logger = new Logger('background')

declare global {
  function r(): void
}

export interface BackgroundService {}

const services = []

browser.runtime.onInstalled.addListener(({ reason }) => {
  logger.log('Extension installed:', reason)
  if (reason === 'install') {
    browser.notifications.create({
      type: 'basic',
      title: 'Thanks for installing!',
      message:
        'Welcome to a more productive homepage tailored just for you. Click here to open your new homepage!',
      iconUrl: browser.runtime.getURL('icons/hand-wave.png')
    })
  }
})

browser.notifications.onClicked.addListener((notificationId) => {
  logger.log('Notification clicked:', notificationId)
  browser.tabs.create({ url: '/index.html' })
})

logger.log('Service worker activated')
services.push(new FocusService())

if (import.meta.env.DEV) {
  // add global r() function to make development easier reloading
  // the background script
  globalThis.r = () => {
    browser.runtime.reload()
  }
}
