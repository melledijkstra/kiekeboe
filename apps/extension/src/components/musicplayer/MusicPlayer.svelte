<script lang="ts">
  import Devices from './Devices.svelte'
  import TrackFeedback from './Playback.svelte'
  import type { MusicPlayerInterface, Playlist } from 'MusicPlayer'
  import { spotifyState } from '@/modules/spotify/spotify.state.svelte'
  import { MPState } from './state.svelte'
  import { SpotifyController } from '@/controllers/SpotifyController'

  const { controller }: { controller: MusicPlayerInterface } = $props()

  function playPause() {
    // Use play or pause based on current playback state
    if (MPState.state.isPlaying) {
      controller.pause()
    } else {
      controller.play()
    }
  }
</script>

{#snippet renderPlaylist(playlist: Playlist)}
  <button
    class="flex flex-row items-center py-1 px-2 hover:bg-zinc-800 cursor-pointer rounded-sm"
    onclick={() => (controller as SpotifyController).playItem(playlist)}
  >
    <img
      class="size-10"
      src={playlist.coverArtUrl ?? '/icons/album-cover-placeholder.png'}
      alt="Playlist cover"
    />
    <div class="flex flex-col ml-2">
      <p>{playlist.title}</p>
      <p>{playlist.tracks.length} songs</p>
    </div>
  </button>
{/snippet}

{#await controller.getPlaylists()}
  <p class="text-sm">Loading playlists...</p>
{:then playlists}
  <ul class="py-2 overflow-y-auto">
    {#each playlists as playlist (playlist.id)}
      <li>{@render renderPlaylist(playlist)}</li>
    {/each}
  </ul>
{:catch error}
  <p class="text-sm text-red-500">Error loading playlists: {error.message}</p>
{/await}
<TrackFeedback
  playbackState={MPState.state}
  onPreviousTrack={() => controller.previous()}
  onPlayPause={playPause}
  onNextTrack={() => controller.next()}
  onSeek={(pos) => controller.seek(pos)}
/>
<Devices
  playerDeviceId={spotifyState.deviceId}
  devices={spotifyState.devices}
  onActivate={(deviceId) => controller.activateDevice?.(deviceId)}
/>
