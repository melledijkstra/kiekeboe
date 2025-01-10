export function millisecondsToTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const secondsLeft = seconds % 60

  return `${minutes}:${secondsLeft.toString().padStart(2, '0')}`
}
