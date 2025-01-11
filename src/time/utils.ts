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
