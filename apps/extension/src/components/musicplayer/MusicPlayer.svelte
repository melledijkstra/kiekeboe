<script lang="ts">
  import Devices from './Devices.svelte'
  import Playback from './Playback.svelte'
  import Playlists from './Playlists.svelte'
  import type { MusicPlayerInterface, Playlist, PlaybackState } from 'MusicPlayer'
  import type { Device } from 'SpotifyApi'
  import ListSkeleton from './ListSkeleton.svelte'
  import ScrollArea from '../atoms/ScrollArea.svelte'
  import TrackList from './TrackList.svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import { derived, writable } from 'svelte/store'

  const {
    state: MPState,
    controller,
    devices,
    deviceId
  }: {
    state: PlaybackState
    controller: MusicPlayerInterface
    devices: Device[]
    deviceId?: string
  } = $props()

  const selectedPlaylist = writable<Playlist| undefined>()

  function playPause() {
    // Use play or pause based on current playback state
    if (MPState.isPlaying) {
      controller.pause()
    } else {
      controller.play()
    }
  }

  const playlistsQuery = createQuery({
    queryKey: ['spotify', 'playlists'],
    queryFn: () => controller.getPlaylists()
  })

  const playlistItemsQuery = createQuery(
    derived(selectedPlaylist, (playlist) => ({
      queryKey: ['spotify', 'playlist', playlist?.id, 'items'],
      enabled: !!playlist,
      queryFn: () => controller.getPlaylistItems(playlist as Playlist)
    })
  ))
</script>

<div class="grid grid-cols-2 grid-rows-3 music-player w-full h-full overflow-hidden">
  <ScrollArea scrollbarClasses="bg-transparent" orientation="vertical">
    {#if $playlistsQuery.isFetching}
      <ListSkeleton amount={20} />
    {:else if $playlistsQuery.isSuccess}
      <Playlists
        playlists={$playlistsQuery.data}
        onPlaylistPlay={(playlist) => controller.playItem(playlist)}
        onPlaylistSelected={(playlist) => {console.log(playlist); selectedPlaylist.set(playlist)}}
      />
    {:else}
      <p class="text-sm text-red-500">Error loading playlists: {$playlistsQuery?.error?.message}</p>
    {/if}
  </ScrollArea>
  <ScrollArea scrollbarClasses="bg-transparent" orientation="vertical">
    {#if $playlistItemsQuery.isFetching}
      <ListSkeleton amount={20} />
    {:else if $playlistItemsQuery.isSuccess}
      <TrackList
        tracks={$playlistItemsQuery.data ?? []}
        onTrackSelected={(track) => controller.playItem(track)}
      />
    {/if}
  </ScrollArea>
  <Playback
    class="col-span-2"
    playbackState={MPState}
    onPreviousTrack={() => controller.previous()}
    onPlayPause={playPause}
    onNextTrack={() => controller.next()}
    onSeek={(pos) => controller.seek(pos)}
    onVolumeChange={(volume) => controller.setVolume(volume)}
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
