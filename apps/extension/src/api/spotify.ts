import type { AuthClient } from '@/oauth2/auth'
import type { Device, PlaybackState, Playlist } from 'SpotifyApi'
import { TokenBaseClient } from './tokenbaseclient'
import { Logger } from '@/logger'
import type { ILogger } from '@/interfaces/logger.interface'

const BASE_URL = 'https://api.spotify.com/v1'

export class SpotifyApiClient extends TokenBaseClient implements ILogger {
  logger = new Logger('SpotifyClient')

  constructor(private authClient: AuthClient) {
    super(BASE_URL, '')
  }

  async retrieveAccessToken() {
    if (this.getAccessToken() !== '') {
      return
    }

    const token = await this.authClient.getAuthToken()

    if (token) {
      super.setAccessToken(token)
    }
  }

  async transferPlaybackDevice(deviceId: string) {
    await this.retrieveAccessToken()
    try {
      await this.request(`/me/player`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: false
        })
      })
      return true
    } catch (error) {
      this.logger.error('Failed to transfer playback device:', error)
      return false
    }
  }

  async availableDevices(): Promise<Device[] | undefined> {
    type Response = {
      devices: Device[]
    }

    await this.retrieveAccessToken()

    const response = await this.request<Response>('/me/player/devices')

    if (response) {
      return response.devices
    }
  }

  async seekToPosition(position: number) {
    await this.retrieveAccessToken()
    this.request(`/me/player/seek?position_ms=${position}`, {
      method: 'PUT'
    })
  }

  async toggleShuffle(state: boolean) {
    await this.retrieveAccessToken()
    await this.request(`/me/player/shuffle?state=${state ? 'true' : 'false'}`, {
      method: 'PUT'
    })
  }

  async userPlaylists(): Promise<Array<Playlist>> {
    await this.retrieveAccessToken()
    const response = await this.request<{ items: Array<Playlist> }>('/me/playlists')

    return response?.items ?? []
  }

  async startPlayback(contextUri?: string, offset?: number) {
    const body: Record<string, unknown> = {
      position_ms: 0
    }

    if (contextUri) {
      body.context_uri = contextUri
    }

    if (offset) {
      body.offset = { position: offset }
    }

    await this.retrieveAccessToken()
    await this.request('/me/player/play', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }

  async getPlaybackState() {
    await this.retrieveAccessToken()
    this.logger.log('Retrieving playback state from Spotify Web API')
    const response = await this.request<PlaybackState>('/me/player')

    if (response) {
      return response
    }

    return undefined
  }

  async toggleRepeatMode(repeatMode: string | number): Promise<void> {
    await this.retrieveAccessToken()
    const mode = typeof repeatMode === 'number' ? repeatMode : (repeatMode === 'off' ? 'off' : 'context')
    
    await this.request(`/me/player/repeat?state=${mode}`, {
      method: 'PUT'
    })
  }

  async play(context_uri?: string) {
    await this.retrieveAccessToken()

    const options: RequestInit = {
      method: 'PUT',
    }

    if (context_uri) {
      options.body = JSON.stringify({ context_uri });
    }

    await this.request('/me/player/play', options)
  }

  async pause() {
    await this.retrieveAccessToken()
    await this.request('/me/player/pause', {
      method: 'PUT',
    })
  }

  async previousTrack() {
    await this.retrieveAccessToken()
    await this.request('/me/player/previous', {
      method: 'POST'
    })
  }

  async nextTrack() {
    await this.retrieveAccessToken()
    await this.request('/me/player/next', {
      method: 'POST'
    })
  }

  async seek(position_ms: number) {
    await this.retrieveAccessToken()
    await this.request(`/me/player/seek?position_ms=${position_ms}`, {
      method: 'PUT'
    })
  }
}
