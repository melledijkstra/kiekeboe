import { log } from '@/logger'
import browser from 'webextension-polyfill'

const BASE_URL = 'https://accounts.spotify.com'

type TokenResponse = {
  access_token: string
  expires_in: number
  id_token: string
  refresh_token: string
  scope?: string
  token_type?: string
}

type TokenStore = {
  access_token: string
  expires_at: number
  refresh_token: string
}

const OAUTH2_STORAGE_KEY = 'oauth2.spotify'

const SCOPES = [
  'streaming',
  'app-remote-control',
  'user-read-playback-state',
  'user-modify-playback-state'
]

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

async function cacheAuthToken(
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
    [OAUTH2_STORAGE_KEY]: tokenStore
  })
}

async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse | null> {
  try {
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID

    const refreshResponse = await fetch(`${BASE_URL}/api/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        refresh_token: refreshToken
      })
    })

    if (!refreshResponse.ok) {
      console.error(
        'Refresh token request failed:',
        await refreshResponse.text()
      )
      return null
    }

    const tokenData = (await refreshResponse.json()) as TokenResponse

    log('spotify: refreshed token data', tokenData)

    return tokenData
  } catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

export async function getTokenFromStoreOrRefreshToken(): Promise<
  string | undefined
> {
  const { [OAUTH2_STORAGE_KEY]: storeToken } = (await browser.storage.local.get(
    OAUTH2_STORAGE_KEY
  )) as {
    [OAUTH2_STORAGE_KEY]: TokenStore | undefined
  }

  let { access_token, refresh_token, expires_at } = storeToken ?? {}

  log('spotify: token in storage?', { storeToken })

  // Subtract some buffer (60 seconds) to ensure we refresh before actual expiry
  const isTokenExpired = !expires_at || Date.now() > expires_at - 60_000

  log('spotify: expired?', { isTokenExpired, refresh_token })

  if (isTokenExpired && refresh_token) {
    // Refresh the token
    const newTokens = await refreshAccessToken(refresh_token)
    if (!newTokens) {
      throw new Error('Failed to refresh token – user must re-authenticate.')
    }

    log('spotify: refreshed new access token, storing it and continue')

    cacheAuthToken(
      newTokens.access_token,
      // If provider doesn’t return a new refresh token, keep the old one
      newTokens.refresh_token ?? refresh_token,
      newTokens.expires_in
    )

    return newTokens.access_token
  }

  return access_token
}

export async function getAuthTokenData(): Promise<string | undefined> {
  const storedToken = await getTokenFromStoreOrRefreshToken()

  if (storedToken) {
    log('spotify: we have a refreshed or stored token, lets use it', {
      storedToken
    })
    return storedToken
  }

  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const state = generateRandomString(16)
  const codeVerifier = generateRandomString(64)
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed)

  const redirectUrl = browser.identity.getRedirectURL()

  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    scope: SCOPES.join(' '),
    redirect_uri: redirectUrl,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: state
  })

  log('spotify: ', queryParams.toString())

  const authUrl = `${BASE_URL}/authorize?${queryParams}`

  const responseUrl = await browser.identity.launchWebAuthFlow({
    url: authUrl,
    interactive: true
  })

  log('spotify: response url', responseUrl)

  if (browser.runtime.lastError || !responseUrl) {
    console.error('Error during authentication:', browser.runtime.lastError)
    return
  }

  // instead of retrieving an auth code, we retrieve the access token directly
  // example: https://kaeibbjbbioodhkpgclmhdhnoggcikhi.chromiumapp.org/?code=AQAPTMAkxtT5Jb7m66EPZaBiDV_vY9G4EpsyhQGU8YeYFtlLHpjAgA5_UVyUMYD-AyZVtM8HcbDD_GteAM6hrHmShHqIYcQQT1-aG9DHTYhoGiMEoX8Crb-bBZ0GRkJ4PUn3p4IHSZQr-xjytKtHxEQXIPIJC-sX5Orw5KrnbwLWu1NArnYsKQZMrW__bt79C77_99z4bv9RQ2eI4hbrMnvr1r5iaTO9zDpdox-u7tWaHXFLawfscvyB4ZyboY6JEU662OzHhbgdSLrwcONj_2eibzdE1_VR3mN6T5QyqHK54lj4O0aCZ0gRkUWXZKVrGKTZ7D0U7NlSuZDac0SN&state=HRgOKcBOAaRjxuEZ
  const responseParams = new URL(responseUrl).searchParams
  const authCode = responseParams.get('code')
  const responseError = responseParams.get('error')
  const responseState = responseParams.get('state')

  log('spotify: auth code', authCode)

  if (responseError) {
    console.error('Error during authentication:', responseError)
    return
  }

  if (!authCode || state !== responseState) {
    console.error('No auth code found or state mismatch!')
    return
  }

  try {
    const tokenResponse = await fetch(`${BASE_URL}/api/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUrl,
        client_id: CLIENT_ID,
        code_verifier: codeVerifier
      })
    })

    const tokenData = (await tokenResponse.json()) as TokenResponse

    if (tokenData.refresh_token) {
      cacheAuthToken(
        tokenData.access_token,
        tokenData.refresh_token,
        tokenData.expires_in
      )
    }

    return tokenData.access_token
  } catch (error) {
    console.error('Token exchange failed:', error)
  }
}
