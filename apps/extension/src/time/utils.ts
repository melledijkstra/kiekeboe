export function getBrowserLocale(): string {
  if (navigator.languages !== undefined) return navigator.languages[0]
  return navigator.language
}

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

export function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
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

export function getTime(): string {
  const locale = getBrowserLocale()
  const date = new Date()
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Returns a string representing how much of the day has passed in percentage form.
 *
 * @returns A string such as "50%" indicating the percentage of the day that has passed.
 */
export function getTimePercentage(): string {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  // 1440 minutes in a day
  return `${Math.round(((hours * 60 + minutes) / 1440) * 100)}%`
}

export function playbackLoop(
  callback: (position: number) => void,
  interval: number,
  initialPosition: number = 0
): () => void {
  let position = initialPosition

  const loop = setInterval(() => {
    position += interval
    callback(position)
  }, interval)

  return () => {
    clearInterval(loop)
  }
}
