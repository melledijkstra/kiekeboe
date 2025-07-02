import browser from 'webextension-polyfill'
import { Logger } from '@/logger'
import type { AuthClient } from '@/oauth2/auth'

const logger = new Logger('SpotifySDK')

const SPOTIFY_SDK_FILE = 'spotify-sdk.min.js'

/**
 * Handles the loading of the Spotify SDK within the Chrome Extension
 */
export function loadSpotifySDK(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    logger.log('Loading Spotify SDK')
    const sdkFile = browser.runtime.getURL(SPOTIFY_SDK_FILE)
    // check if the script is already loaded
    if (document.querySelector(`script[src="${sdkFile}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = sdkFile
    script.onload = () => {
      logger.log('Spotify SDK loaded')
      resolve()
    }
    script.onerror = () => {
      reject(new Error('Failed to load Spotify SDK'))
    }
    document.head.appendChild(script)
  })
}

export async function initializeSpotifyPlayer(
  authClient: AuthClient,
  initialVolume: number = 0.5
): Promise<Spotify.Player> {
  return new Promise((resolve, reject) => {
    try {
      window.onSpotifyWebPlaybackSDKReady = () => {
        logger.log('Spotify Web Playback SDK is ready, setting up player')
        const player = new window.Spotify.Player({
          name: 'Personal Homepage Player',
          getOAuthToken: async (callback) => {
            const token = await authClient.getAuthToken()
            if (token) {
              callback(token)
            }
          },
          volume: initialVolume
        })

        resolve(player)
      }
      loadSpotifySDK()
    } catch (error) {
      reject(error)
    }
  })
}
