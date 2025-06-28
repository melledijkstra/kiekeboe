const LOCK_KEY = 'spotify-tab-lock';

export function acquireTabLock(): boolean {
  const existing = localStorage.getItem(LOCK_KEY)
  if (!existing) {
    localStorage.setItem(LOCK_KEY, Date.now().toString());
    return true;
  }
  return false;
}

export function lockExists(): boolean {
  return localStorage.getItem(LOCK_KEY) !== null;
}

export function releaseTabLock(): void {
  localStorage.removeItem(LOCK_KEY);
}
