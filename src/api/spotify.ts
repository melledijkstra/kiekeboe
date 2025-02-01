import { BaseClient } from './baseclient'
import type { Device } from './definitions/spotify'

const BASE_URL = 'https://api.spotify.com/v1'

export class SpotifyClient extends BaseClient {
  constructor(token: string) {
    super(BASE_URL, token)
  }

  async transferPlaybackDevice(deviceId: string) {
    const response = await this.request(`/me/player`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false
      })
    })

    if (response) {
      return true
    }

    return false
  }

  async availableDevices(): Promise<Device[] | undefined> {
    type Response = {
      devices: Device[]
    }

    const response = await this.request<Response>('/me/player/devices')

    if (response) {
      return response.devices
    }
  }

  async seekToPosition(position: number) {
    this.request(`/me/player/seek?position_ms=${position}`, {
      method: 'PUT'
    })
  }

  async toggleShuffle(state: boolean) {
    await this.request(`/me/player/shuffle?state=${state ? 'true' : 'false'}`, {
      method: 'PUT'
    })
  }
}
