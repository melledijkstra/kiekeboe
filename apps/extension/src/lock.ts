const LOCK_KEY = 'spotify-tab-lock';

const storage = localStorage;

export function acquireTabLock(): boolean {
  const existing = storage.getItem(LOCK_KEY)
  if (!existing) {
    storage.setItem(LOCK_KEY, Date.now().toString());
    return true;
  }
  return false;
}

export function lockExists(): boolean {
  return storage.getItem(LOCK_KEY) !== null;
}

export function releaseTabLock(): void {
  storage.removeItem(LOCK_KEY);
}
