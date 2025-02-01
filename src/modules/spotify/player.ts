import browser from 'webextension-polyfill'
import { log } from '@/logger'

const SPOTIFY_SDK_FILE = 'spotify-sdk.min.js'

/**
 * Handles the loading of the Spotify SDK within the Chrome Extension
 */
export function loadSpotifySDK(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const sdkFile = browser.runtime.getURL(SPOTIFY_SDK_FILE)
    // check if the script is already loaded
    if (document.querySelector(`script[src="${sdkFile}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = sdkFile
    script.onload = () => {
      log('Spotify SDK loaded')
      resolve()
    }
    script.onerror = () => {
      reject(new Error('Failed to load Spotify SDK'))
    }
    document.head.appendChild(script)
  })
}

export async function initializeSpotifyPlayer(
  token: string
): Promise<Spotify.Player> {
  return new Promise(async (resolve, reject) => {
    try {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Personal Homepage Player',
          getOAuthToken: (cb) => cb(token),
          volume: 0.5
        })

        resolve(player)
      }
      await loadSpotifySDK()
    } catch (error) {
      reject(error)
    }
  })
}
