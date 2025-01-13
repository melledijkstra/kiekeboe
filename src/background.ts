import browser from 'webextension-polyfill'
import { log } from './logger'

log('Hello from background!')

browser.runtime.onInstalled.addListener(({ reason }) => {
  log('Extension installed:', reason)
  if (reason === 'update') {
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
