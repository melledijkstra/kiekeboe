<script lang="ts">
  import Devices from './Devices.svelte'
  import TrackFeedback from './Playback.svelte'
  import Playlists from './Playlists.svelte'
  import type { MusicPlayerInterface, Playlist, State, Track } from 'MusicPlayer'
  import type { Device } from 'SpotifyApi'
  import PlaylistSkeleton from './PlaylistSkeleton.svelte'
  import ScrollArea from '../atoms/ScrollArea.svelte'
  import TrackList from './TrackList.svelte'

  const {
    state: MPState,
    controller,
    devices,
    deviceId
  }: {
    state: State
    controller: MusicPlayerInterface
    devices: Device[]
    deviceId?: string
  } = $props()

  let trackList: Track[] | null = $state([])

  function playPause() {
    // Use play or pause based on current playback state
    if (MPState.isPlaying) {
      controller.pause()
    } else {
      controller.play()
    }
  }

  async function selectPlaylist(playlist: Playlist) {
    const tracks = await controller.getPlaylistItems(playlist)

    if (!tracks) {
      console.error('No tracks found for the selected playlist')
      return
    }

    trackList = tracks
  }
</script>

<div class="grid grid-cols-2 grid-rows-3 music-player w-full h-full overflow-hidden">
  <ScrollArea scrollbarClasses="bg-transparent" orientation="vertical">
    {#await controller.getPlaylists()}
      <PlaylistSkeleton amount={20} />
    {:then playlists}
      <Playlists
        playlists={playlists}
        onPlaylistPlay={(playlist) => controller.playItem(playlist)}
        onPlaylistSelected={(playlist) => selectPlaylist(playlist)}
      />
    {:catch error}
      <p class="text-sm text-red-500">Error loading playlists: {error.message}</p>
    {/await}
  </ScrollArea>
  <ScrollArea scrollbarClasses="bg-transparent" orientation="vertical">
    {#if !trackList}
      <PlaylistSkeleton amount={20} />
    {:else}
      <TrackList
        tracks={trackList}
        onTrackSelected={(track) => controller.playItem(track)}
      />
    {/if}
  </ScrollArea>
  <TrackFeedback
    class="col-span-2"
    playbackState={MPState}
    onPreviousTrack={() => controller.previous()}
    onPlayPause={playPause}
    onNextTrack={() => controller.next()}
    onSeek={(pos) => controller.seek(pos)}
  />
  <Devices
    class="col-span-2"
    playerDeviceId={deviceId}
    devices={devices}
    onActivate={(deviceId) => controller.activateDevice?.(deviceId)}
  />
</div>

<style>
  .music-player {
    grid-template-columns: 0.5fr 1fr;
    grid-template-rows: 1fr auto auto;
  }
</style>
