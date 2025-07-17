import { getCurrentTab } from "@/browser";
import { log } from "@/logger";

const LOCK_KEY = 'music-player-tab-lock';

const storage = localStorage;

export async function acquireTabLock(): Promise<boolean> {
  const tab = await getCurrentTab();
  const tabId = tab.id?.toString() ?? '';
  const existing = storage.getItem(LOCK_KEY);

  console.log('acquireTabLock', tabId, existing);

  if (!existing) {
    storage.setItem(LOCK_KEY, tabId);
    log('acquired tab lock', tabId);
    return true;
  }

  return existing === tabId;
}

export async function hasTabLockAcquired(): Promise<boolean> {
  const tab = await getCurrentTab()
  const tabId = tab.id?.toString() ?? '';
  const existing = storage.getItem(LOCK_KEY);
  console.log('hasLockAcquired', tabId, existing, existing === tabId);
  return existing === tabId
}

export function lockExists(): boolean {
  return storage.getItem(LOCK_KEY) !== null;
}

export async function releaseTabLock(): Promise<boolean> {
  const tab = await getCurrentTab()
  const tabId = tab.id?.toString() ?? '';
  const existing = storage.getItem(LOCK_KEY);

  // only allow releasing the lock if it's the same tab that acquired it
  if (existing && existing === tabId) {
    storage.removeItem(LOCK_KEY);
    log('released tab lock', tabId);
    return true;
  }
  return false;
}
