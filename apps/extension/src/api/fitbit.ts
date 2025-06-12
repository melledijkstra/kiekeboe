import { BaseClient } from './baseclient'
import type { SleepResponse } from './definitions/fitbit'

const BASE_URL = 'https://api.fitbit.com'

export class FitbitClient extends BaseClient {
  constructor(token: string) {
    super(BASE_URL, token)
  }

  async getSleep(): Promise<number> {
    const date = new Date().toISOString().split('T')[0]
    const response = await this.request<SleepResponse>(`/1/user/-/sleep/date/${date}.json`)

    if (response) {
      return response.summary.totalMinutesAsleep
    }

    return 0
  }
}
