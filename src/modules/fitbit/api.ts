import { log } from '@/logger'

const BASE_URL = 'https://api.fitbit.com'

export async function getSleep(token: string): Promise<number> {
  const date = new Date().toISOString().split('T')[0]
  const response = await fetch(
    `${BASE_URL}/1.2/user/-/sleep/date/${date}.json`,
    {
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/json'
      }
    }
  )

  if (!response.ok) {
    console.error('Fitbit call failed: ', await response.text())
  }

  const body = await response.json()

  return body.summary.totalMinutesAsleep
}
