import { getBrowserLocale } from "@/ui"

export function repeatEvery(callback: () => void, interval: number) {
  // Check current time and calculate the delay until next interval
  const delay = interval - (Date.now() % interval)
  let timeoutId: number
  let intervalId: number

  function start() {
    callback()
    intervalId = setInterval(callback, interval)
  }
  // Delay execution until it's an even interval
  timeoutId = setTimeout(start, delay)

  return () => {
    if (timeoutId) clearTimeout(timeoutId)
    if (intervalId) clearInterval(intervalId)
  }
}

export function millisecondsToTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const secondsLeft = seconds % 60

  return `${minutes}:${secondsLeft.toString().padStart(2, '0')}`
}

export function renderTimezone(timezone: string) {
  const browserLocale = getBrowserLocale()
  return new Date().toLocaleString(browserLocale, {
    timeStyle: 'short',
    timeZone: timezone
  })
}

export function calculateDays(timestamp: number) {
  const a = new Date()
  const b = new Date(timestamp)
  const _MS_PER_DAY = 1000 * 60 * 60 * 24
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

  return Math.floor((utc2 - utc1) / _MS_PER_DAY)
}
