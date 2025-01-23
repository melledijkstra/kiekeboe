import browser from 'webextension-polyfill'
import manifest from '../../manifest.json'
import { log } from '@/logger'

type OauthProvider = 'google' | 'spotify' | 'fitbit'

type AuthConfig = {
  clientId: string
  scopes: string[]
  authEndpoint: string
  tokenEndpoint: string
}

const oauthConfig: Record<OauthProvider, AuthConfig> = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scopes: manifest.oauth2.scopes,
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token'
  },
  fitbit: {
    clientId: import.meta.env.VITE_FITBIT_CLIENT_ID,
    scopes: ['sleep', 'activity'],
    authEndpoint: 'https://www.fitbit.com/oauth2/authorize',
    tokenEndpoint: 'https://api.fitbit.com/oauth2/token'
  },
  spotify: {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    scopes: [
      'streaming',
      'app-remote-control',
      'user-read-playback-state',
      'user-modify-playback-state'
    ],
    authEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token'
  }
}

const OAUTH2_STORAGE_KEY = 'oauth2'

type TokenResponse = {
  access_token: string
  expires_in: number
  id_token: string
  refresh_token?: string
  scope?: string
  token_type?: string
}

type TokenStore = {
  access_token: string
  expires_at: number
  refresh_token: string
}

const generateRandomString = (length: number) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

const storageKey = (provider: string) => `${OAUTH2_STORAGE_KEY}.${provider}`

export async function getAuthTokenChrome(
  interactive = true
): Promise<string | undefined> {
  const oauth2 = await chrome.identity.getAuthToken({ interactive })
  return oauth2.token
}

async function cacheAuthToken(
  provider: OauthProvider,
  access_token: string,
  refresh_token: string,
  expires_in: number
) {
  const tokenStore: TokenStore = {
    access_token,
    refresh_token,
    expires_at: Date.now() + expires_in * 1000
  }

  await browser.storage.local.set({
    [storageKey(provider)]: tokenStore
  })
}

export async function getTokenFromStoreOrRefreshToken(
  provider: OauthProvider
): Promise<string | undefined> {
  const key = storageKey(provider)
  const { [key]: storeToken } = (await browser.storage.local.get(key)) as {
    [key: string]: TokenStore
  }

  let { access_token, refresh_token, expires_at } = storeToken ?? {}

  log(provider, 'token in storage?', { storeToken })

  // Subtract some buffer (60 seconds) to ensure we refresh before actual expiry
  const isTokenExpired = !expires_at || Date.now() > expires_at - 60_000

  log(provider, 'expired?', { isTokenExpired, refresh_token })

  if (isTokenExpired && refresh_token) {
    // Refresh the token
    const newTokens = await refreshAccessToken(provider, refresh_token)
    if (!newTokens) {
      throw new Error('Failed to refresh token – user must re-authenticate.')
    }

    access_token = newTokens.access_token

    log(provider, 'refreshed new access token, storing it and continue')
    cacheAuthToken(
      provider,
      newTokens.access_token,
      // if provider doesn’t return a new refresh token, keep the old one
      newTokens.refresh_token ?? refresh_token,
      newTokens.expires_in
    )
  }

  return access_token
}

async function refreshAccessToken(
  provider: OauthProvider,
  refreshToken: string
): Promise<TokenResponse | null> {
  try {
    const config = oauthConfig[provider]

    const response = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: config.clientId,
        refresh_token: refreshToken
      })
    })

    if (!response.ok) {
      console.error(
        provider,
        'Refresh token request failed:',
        await response.text()
      )
      return null
    }

    const tokenData = (await response.json()) as TokenResponse
    log(provider, 'refreshed token data', tokenData)

    return tokenData
  } catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

export async function getAuthToken(
  provider: OauthProvider
): Promise<string | undefined> {
  if (provider === 'google' && typeof chrome !== 'undefined') {
    // if we are on chrome browser then use the preferred auth token
    // method that is already build in
    try {
      const token = await getAuthTokenChrome()
      if (token) {
        return token
      }
    } catch (e) {
      console.error(
        `${provider}: No luck retrieving oauth token using build in functionality, trying manually`,
        e
      )
    }
  }

  const config = oauthConfig[provider]

  const storedToken = await getTokenFromStoreOrRefreshToken(provider)

  if (storedToken) {
    log(provider, 'we have a refreshed or stored token, lets use it', {
      storedToken
    })
    return storedToken
  }

  log(
    provider,
    'no token retrieved in any way, continue with normal oauth2 flow...'
  )

  const redirectUrl = browser.identity.getRedirectURL()
  const state = generateRandomString(16)
  const codeVerifier = generateRandomString(64)
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed)

  const queryParams = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code',
    scope: config.scopes.join(' '),
    redirect_uri: redirectUrl,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: state
  })

  const authUrl = new URL(config.authEndpoint)
  authUrl.search = queryParams.toString()

  log({
    provider,
    redirectUrl,
    authUrl: authUrl.toString()
  })

  const responseUrl = await browser.identity.launchWebAuthFlow({
    url: authUrl.toString(),
    interactive: true
  })

  log(provider, 'responseUrl', responseUrl)

  if (browser.runtime.lastError || !responseUrl) {
    console.error(
      provider,
      'Error during authentication:',
      browser.runtime.lastError
    )
    return
  }

  const responseParams = new URL(responseUrl).searchParams
  const authCode = responseParams.get('code')
  const responseError = responseParams.get('error')
  const responseState = responseParams.get('state')

  log(provider, 'auth code', authCode)

  if (responseError) {
    console.error('Error during authentication:', responseError)
    return
  }

  if (!authCode || state !== responseState) {
    console.error('No auth code found or state mismatch!')
    return
  }

  try {
    const tokenResponse = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUrl,
        client_id: config.clientId,
        code_verifier: codeVerifier
      })
    })

    const tokenData = (await tokenResponse.json()) as TokenResponse

    if (tokenData.refresh_token) {
      cacheAuthToken(
        provider,
        tokenData.access_token,
        tokenData.refresh_token,
        tokenData.expires_in
      )
    }

    return tokenData.access_token
  } catch (error) {
    console.error(provider, 'Token exchange failed:', error)
  }
}
