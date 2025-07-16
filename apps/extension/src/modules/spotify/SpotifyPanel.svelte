<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { SpotifyController } from '@/controllers/SpotifyController'
  import MusicPlayer from '@/components/musicplayer/MusicPlayer.svelte'
  import { spotifyState } from './spotify.state.svelte'
  import PopPanel from '@/components/atoms/PopPanel.svelte'
  import type { PlaybackState } from 'MusicPlayer'

  const { playbackState, controller }: {
    playbackState: PlaybackState
    controller: SpotifyController
  } = $props()

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

<PopPanel panelProps={{
  size: 'large',
  nopadding: true
}} class="flex flex-col">
  {#if !controller.hasLockAcquired()}
    <p class="text-center text-lg">The Spotify Music Player is already initialized in another tab</p>
    <p class="text-center text-sm">
      If you want to use the player here, close the other tab or reload this one.
    </p>
  {:else}
    <MusicPlayer
      state={playbackState}
      controller={controller}
      deviceId={spotifyState.deviceId}
      devices={spotifyState.devices}
    />
  {/if}
</PopPanel>
