<script lang="ts">
  import { mdiSpotify } from '@mdi/js'
  import { AuthClient } from '@/oauth2/auth'
  import Playback from './Playback.svelte'
  import { onMount } from 'svelte'
  import { clickOutside } from '@/actions/click-outside'
  import IconButton from '@/components/atoms/IconButton.svelte'

  const authClient = new AuthClient('spotify')

  let open = $state(false)
  let token = $state<string>()

  function toggleDisplay() {
    open = !open
  }

  async function authenticate() {
    const tokenData = await authClient.getAuthToken()
    if (tokenData) {
      token = tokenData
    }
  }

  onMount(async () => {
    const tokenData = await authClient.getTokenFromStoreOrRefreshToken()
    if (tokenData) {
      token = tokenData
    }
  })
</script>

<div class="relative" use:clickOutside={() => (open = false)}>
  <IconButton
    tooltip={!open ? 'Spotify' : ''}
    onclick={token ? toggleDisplay : authenticate}
    icon={mdiSpotify}
  />
  {#if token}
    <Playback {open} {token} />
  {/if}
</div>
