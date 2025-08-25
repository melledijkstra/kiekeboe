import type { AuthClient } from '@/oauth2/auth'
import type { SleepResponse } from './definitions/fitbit'
import { TokenBaseClient } from './tokenbaseclient'

const BASE_URL = 'https://api.fitbit.com'

export class FitbitClient extends TokenBaseClient {
  private auth: AuthClient

  constructor(authClient: AuthClient) {
    super(BASE_URL, '')
    this.auth = authClient
  }

  async request<T>(endpoint: string, config?: RequestInit, queryParams?: URLSearchParams): Promise<T | undefined> {
    if (!this.token) {
      const token = await this.auth.getAuthToken()
      this.token = token ?? ''
    }    

    return super.request<T>(endpoint, config, queryParams)
  }

  async getSleep(): Promise<number> {
    const date = new Date().toISOString().split('T')[0]
    const response = await this.request<SleepResponse>(`/1/user/-/sleep/date/${date}.json`)

    if (response) {
      if (response.summary.stages) {
        // this avoids counting the wake time between sleep stages
        const { deep, light, rem } = response.summary.stages
        return deep + light + rem
      }
      // if stages are not available, we can still return total minutes asleep
      return response.summary.totalMinutesAsleep
    }

    return 0
  }
}
