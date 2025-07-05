<script lang="ts">
  import type { Playlist } from 'SpotifyApi'
  import Devices from './Devices.svelte'
  import TrackFeedback from './Playback.svelte'
  import type { MusicPlayerInterface } from '@/controllers/MusicPlayerInterface'
  import type { MediaItem } from 'MusicPlayer'
  import { spotifyState } from '@/modules/spotify/spotify.store.svelte'
  import { apiPlaybackStateToPlayerPlaybackState, trackToMediaItem } from '@/transforms/spotify'
  import { onMount } from 'svelte'

  const { controller }: { controller: MusicPlayerInterface } = $props()

  function toggleShuffle(shuffle: boolean) {
    controller.toggleShuffle(shuffle)
  }

  function previousTrack() {
    controller.previousTrack?.()
  }

  function playPause() {
    // Use play or pause based on current playback state
    if (!spotifyState.playbackState?.is_playing) {
      controller.play()
    } else {
      controller.pause()
    }
  }

  function nextTrack() {
    controller.nextTrack()
  }

  function switchRepeatMode(mode: number) {
    // Optional controller method
    controller.switchRepeatMode?.(mode)
  }

  function seek(position: number) {
    controller.seek?.(position)
  }

  onMount(() => {
    controller.retrievePlaybackState()
  })
</script>

{#snippet renderPlaylist(playlist: Playlist)}
  <div
    class="flex flex-row items-center py-1 px-2 hover:bg-zinc-800 cursor-pointer rounded-sm"
  >
    <img
      class="size-10"
      src={playlist.images[0]?.url ?? '/icons/album-cover-placeholder.png'}
      alt="Playlist cover"
    />
    <div class="flex flex-col ml-2">
      <p>{playlist.name}</p>
      <p>{playlist.tracks.total} songs</p>
    </div>
  </div>
{/snippet}

{#snippet renderTrack(mediaItem: MediaItem)}
  <div
    class="flex flex-row items-center py-1 px-2 hover:bg-zinc-800 cursor-pointer"
  >
    <img
      class="size-10"
      src={mediaItem.coverArtUrl ?? '/icons/album-cover-placeholder.png'}
      alt="Track cover"
    />
    <div class="flex flex-col ml-2">
      <p>{mediaItem.title}</p>
      <p>{mediaItem.artist}</p>
    </div>
  </div>
{/snippet}

<div class="flex flex-row gap-3">
  <ul class="py-2">
    {#each spotifyState.playlists as playlist (playlist.id)}
      <li>{@render renderPlaylist(playlist)}</li>
    {/each}
  </ul>
  <ul class="py-2">
    {#each spotifyState.tracks as track (track.id)}
      <li>{@render renderTrack(trackToMediaItem(track))}</li>
    {/each}
  </ul>
</div>
<TrackFeedback
  playbackState={apiPlaybackStateToPlayerPlaybackState(spotifyState.playbackState)}
  onToggleShuffle={toggleShuffle}
  onPreviousTrack={previousTrack}
  onPlayPause={playPause}
  onNextTrack={nextTrack}
  onSwitchRepeatMode={switchRepeatMode}
  onSeek={seek}
/>
<Devices
  playerDeviceId={spotifyState.deviceId} 
  devices={spotifyState.devices}
  onActivate={(deviceId) => controller.activateDevice(deviceId)}
/>
