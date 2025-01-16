import browser from 'webextension-polyfill'
import { PomodoroService } from '@/modules/pomodoro/service'
import { log } from './logger'

declare global {
  function r(): void
}

browser.runtime.onInstalled.addListener(({ reason }) => {
  log('Extension installed:', reason)
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
  log('Notification clicked:', notificationId)
  browser.tabs.create({ url: '/index.html' })
})

self.addEventListener('activate', () => {
  log('Service worker activated')
  const pomodoro = new PomodoroService()
})

if (import.meta.env.DEV) {
  // add global r() function to make development easier reloading
  // the background script
  globalThis.r = () => {
    browser.runtime.reload()
  }
}
