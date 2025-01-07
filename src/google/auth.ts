import browser from 'webextension-polyfill'
import manifest from '../../manifest.json'
import { log } from '@/logger'

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

async function getAuthTokenChrome(): Promise<string | undefined> {
  const oauth2 = await chrome.identity.getAuthToken({ interactive: true })
  return oauth2.token
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

async function getTokenFromStoreOrRefreshToken(): Promise<string | undefined> {
  const { [OAUTH2_STORAGE_KEY]: storeToken } = (await browser.storage.local.get(
    OAUTH2_STORAGE_KEY
  )) as {
    oauth2: TokenStore
  }

  let { access_token, refresh_token, expires_at } = storeToken ?? {}

  log('token in storage?', { storeToken })

  // Subtract some buffer (60 seconds) to ensure we refresh before actual expiry
  const isTokenExpired = !expires_at || Date.now() > expires_at - 60_000

  log('expired?', { isTokenExpired, refresh_token })

  if (isTokenExpired && refresh_token) {
    // Refresh the token
    const newTokens = await refreshAccessToken(refresh_token)
    if (!newTokens) {
      throw new Error('Failed to refresh token – user must re-authenticate.')
    }

    access_token = newTokens.access_token

    log('refreshed new access token, storing it and continue')
    cacheAuthToken(
      newTokens.access_token,
      // If provider doesn’t return a new refresh token, keep the old one
      newTokens.refresh_token ?? refresh_token,
      newTokens.expires_in
    )
  }

  return access_token
}

async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse | null> {
  try {
    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
    const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    })

    if (!response.ok) {
      console.error('Refresh token request failed:', await response.text())
      return null
    }

    // Response typically includes: access_token, expires_in, token_type
    // May not always include refresh_token
    return await response.json()
  } catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

export async function getAuthToken(): Promise<string | undefined> {
  // if we are on chrome browser then use the preferred auth token
  // method that is already build in
  if (typeof chrome !== 'undefined') {
    try {
      const token = await getAuthTokenChrome()
      if (token) {
        return token
      }
    } catch (e) {
      console.error(
        'No luck retrieving oauth token using build in functionality, trying manually',
        e
      )
    }
  }

  const storedToken = await getTokenFromStoreOrRefreshToken()

  if (storedToken) {
    log('we have a refreshed or stored token, lets use it', { storedToken })
    return storedToken
  }

  log('no token retrieved in any way, continue with normal oauth2 flow...')

  const redirectUrl = browser.identity.getRedirectURL()
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
  const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', redirectUrl)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', manifest.oauth2.scopes.join(' '))
  authUrl.searchParams.set('prompt', 'consent')
  authUrl.searchParams.set('access_type', 'offline')

  log({
    redirectUrl,
    authUrl: authUrl.toString()
  })

  const responseUrl = await browser.identity.launchWebAuthFlow({
    url: authUrl.toString(),
    interactive: true
  })

  if (browser.runtime.lastError || !responseUrl) {
    console.error('Error during authentication:', browser.runtime.lastError)
    return
  }

  const authCode = new URL(responseUrl).searchParams.get('code')

  log('auth code', authCode)

  if (!authCode) {
    console.error('No authorization code returned.')
    return
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: authCode,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: redirectUrl,
        grant_type: 'authorization_code'
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
