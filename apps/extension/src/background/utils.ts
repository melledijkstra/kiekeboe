import type Browser from 'webextension-polyfill';
import browser from 'webextension-polyfill'

export const isHomepageUrl = (url: string) =>
  url.startsWith(`chrome-extension://${browser.runtime.id}/index.html`) ||
  url.startsWith('chrome://newtab')


export async function findExtensionTab(): Promise<Browser.Tabs.Tab | undefined> {
  const tabs = await browser.tabs.query({});
  const extensionUrl = `chrome-extension://${browser.runtime.id}/index.html`;

  return tabs.find(tab =>
    tab.url?.startsWith(extensionUrl) || tab.url?.startsWith('chrome://newtab')
  );
}

export async function getActiveTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}