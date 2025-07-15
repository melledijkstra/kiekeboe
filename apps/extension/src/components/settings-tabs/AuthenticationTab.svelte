<script lang="ts">
  import AuthButton from '@/components/AuthButton.svelte'
  import { log } from '@/logger'
  import { AuthClient } from '@/oauth2/auth'
  import {
    GoogleAuthProvider,
    SpotifyAuthProvider,
    FitbitAuthProvider,
    type OauthProvider
  } from '@/oauth2/providers'

  const clients = {
    google: new AuthClient(new GoogleAuthProvider()),
    spotify: new AuthClient(new SpotifyAuthProvider()),
    fitbit: new AuthClient(new FitbitAuthProvider())
  } as const

  let authState = $state({
    google: false,
    spotify: false,
    fitbit: false
  })

  async function retrieveAuthState() {
    log('Retrieving authentication state from all providers...')
    authState.google = await clients.google.isAuthenticated()
    authState.spotify = await clients.spotify.isAuthenticated()
    authState.fitbit = await clients.fitbit.isAuthenticated()
  }

  async function authenticate(provider: OauthProvider) {
    const token = await clients[provider].getAuthToken(true)
    authState[provider] = !!token
  }

  async function deauthenticate(provider: OauthProvider) {
    await clients[provider].deauthenticate()
    authState[provider] = false
  }
</script>

<h1 class="text-xl mb-3">Authentication</h1>
{#await retrieveAuthState()}
  <p class="text-base">Loading...</p>
{:then}
  <div class="flex flex-col gap-3">
    <p class="text-sm">
      <strong>Google:</strong>
      <span class="text-gray-400">{authState.google}</span>
        <AuthButton
          class="mt-2"
          authenticated={authState.google}
          provider="google"
          onclick={() => authState.google ? deauthenticate('google') : authenticate('google')}
        />
    </p>
    <p class="text-sm">
      <strong>Spotify:</strong>
      <span class="text-gray-400">{authState.spotify}</span>
      <AuthButton
        class="mt-2"
        authenticated={authState.spotify}
        provider="spotify"
        onclick={() => authState.spotify ? deauthenticate('spotify') : authenticate('spotify')}
      />
    </p>
    <p class="text-sm">
      <strong>Fitbit:</strong>
      <span class="text-gray-400">{authState.fitbit}</span>
      <AuthButton
        class="mt-2"
        authenticated={authState.fitbit}
        provider="fitbit"
        onclick={() => authState.fitbit ? deauthenticate('fitbit') : authenticate('fitbit')}
      />
    </p>
  </div>
{/await}