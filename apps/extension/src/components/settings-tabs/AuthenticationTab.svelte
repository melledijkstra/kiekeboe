<script lang="ts">
  import AuthButton from '@/components/AuthButton.svelte'
  import { log } from '@/logger'
  import { AuthClient } from '@/oauth2/auth'
  import {
    GoogleAuthProvider,
    SpotifyAuthProvider,
    FitbitAuthProvider
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
</script>

<h1 class="text-xl mb-3">Authentication</h1>
{#await retrieveAuthState() then}
  <div class="flex flex-col gap-3">
    <p class="text-sm">
      <strong>Google:</strong>
      <span class="text-gray-400">{authState.google}</span>
        <AuthButton
          class="mt-2"
          disabled={authState.google}
          provider="google"
          onclick={async () => {
            const token = await clients.google.getAuthToken(true)
            authState.google = !!token
          }}
        />
    </p>
    <p class="text-sm">
      <strong>Spotify:</strong>
      <span class="text-gray-400">{authState.spotify}</span>
      <AuthButton
        class="mt-2"
        disabled={authState.spotify}
        provider="spotify"
        onclick={async () => {
          const token = await clients.spotify.getAuthToken(true)
          authState.spotify = !!token
        }}
      />
    </p>
    <p class="text-sm">
      <strong>Fitbit:</strong>
      <span class="text-gray-400">{authState.fitbit}</span>
      <AuthButton
        class="mt-2"
        disabled={authState.fitbit}
        provider="fitbit"
        onclick={async () => {
          const token = await clients.fitbit.getAuthToken(true)
          authState.fitbit = !!token
        }}
      />
    </p>
  </div>
{/await}