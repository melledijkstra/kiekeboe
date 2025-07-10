<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Panel from '@/components/atoms/Panel.svelte'
  import { SpotifyController } from '@/controllers/SpotifyController'
  import MusicPlayer from '@/components/musicplayer/MusicPlayer.svelte'
  import { MPState } from '@/components/musicplayer/state.svelte'
  import { spotifyState } from './spotify.state.svelte'

  const { controller }: { controller: SpotifyController } = $props()

  function cleanup() {
    controller?.destroy()
    window.removeEventListener('beforeunload', cleanup)
  }

  onMount(async () => {
    window.addEventListener('beforeunload', cleanup)

    await controller.initialize()
    controller.syncState()
  })

  onDestroy(cleanup)
</script>

<Panel class="flex flex-col w-[600px] h-[500px]" nopadding>
  {#if !SpotifyController?.hasLockAcquired()}
    <p class="text-center text-lg">The Spotify Music Player is already initialized in another tab</p>
    <p class="text-center text-sm">
      If you want to use the player here, close the other tab or reload this one.
    </p>
  {:else}
    <MusicPlayer
      state={MPState.state}
      controller={controller}
      deviceId={spotifyState.deviceId}
      devices={spotifyState.devices}
    />
  {/if}
</Panel>
