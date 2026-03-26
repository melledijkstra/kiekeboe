/// <reference lib="webworker" />
import browser from 'webextension-polyfill'
import { FocusService } from '@/services/focus'
import { TimeToolsService } from '@/services/time-tools'
import { Logger } from '@/logger'
import { commandCenterOpen } from '@/modules/command-center/messages'
import { settings } from '@/settings/index.svelte'
import { findExtensionTab, getActiveTab, isHomepageUrl } from '@/background/utils'
import { trimCache } from './background/image-cache'

declare const self: ServiceWorkerGlobalScope;

export const logger = new Logger('background')

declare global {
  function r(): void
}

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

browser.commands.onCommand.addListener(async (command) => {
  logger.log('Command received:', command)
  const { modules } = await settings.getSettingsFromStorage()
  if (command === "toggle-command-center" && modules.command_center) {
    const tab = await getActiveTab()
    // first check if we are on homepage, if so, we can just open the command center
    if (tab?.url && isHomepageUrl(tab.url)) {
      logger.log(tab.url);
      // open the command center by sending a message to the content script
      commandCenterOpen.send()
      return;
    }
    
    const extensionTab = await findExtensionTab()

    if (extensionTab) {
      // if we have an existing tab with the command center, just focus it
      await browser.tabs.update(extensionTab.id, { active: true });
      commandCenterOpen.send()
      return;
    }
    
    browser.tabs.create({
      url: browser.runtime.getURL('/index.html?command-center=true'),
      active: true
    });
  }
});

browser.notifications.onClicked.addListener((notificationId) => {
  logger.log('Notification clicked:', notificationId)
  browser.tabs.create({ url: '/index.html' })
})

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // clean up any stale entries right away
  e.waitUntil(trimCache());
});

logger.log('Service worker activated')
services.push(new FocusService())
services.push(new TimeToolsService())

if (import.meta.env.DEV) {
  // add global r() function to make development easier reloading
  // the background script
  globalThis.r = () => {
    browser.runtime.reload()
  }
}
