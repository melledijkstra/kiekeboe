import manifest from '../../manifest.json' with { type: 'json' }

export type OauthProvider = 'google' | 'spotify' | 'fitbit'

export interface AuthProvider {
  name: OauthProvider
  clientId: string
  scopes: string[]
  authEndpoint: string
  tokenEndpoint: string
}

import { settingsStore } from '@/settings/index.svelte'
import { get } from 'svelte/store'

export class GoogleAuthProvider implements AuthProvider {
  name: OauthProvider = 'google'
  get clientId() {
    return get(settingsStore).apiKeys.google || ''
  }
  scopes = manifest.oauth2.scopes
  authEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
  tokenEndpoint = 'https://oauth2.googleapis.com/token'
}

export class SpotifyAuthProvider implements AuthProvider {
  name: OauthProvider = 'spotify'
  get clientId() {
    return get(settingsStore).apiKeys.spotify || ''
  }
  scopes = [
    'streaming',
    'app-remote-control',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-read-private'
  ]
  authEndpoint = 'https://accounts.spotify.com/authorize'
  tokenEndpoint = 'https://accounts.spotify.com/api/token'
}

export class FitbitAuthProvider implements AuthProvider {
  name: OauthProvider = 'fitbit'
  get clientId() {
    return get(settingsStore).apiKeys.fitbit || ''
  }
  scopes = ['sleep', 'activity']
  authEndpoint = 'https://www.fitbit.com/oauth2/authorize'
  tokenEndpoint = 'https://api.fitbit.com/oauth2/token'
}

