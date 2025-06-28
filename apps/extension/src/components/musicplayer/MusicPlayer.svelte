<script lang="ts">
  import type { Playlist } from '@/api/definitions/spotify'
  import Devices from './Devices.svelte'
  import TrackFeedback from './Playback.svelte'
  import { playlists } from '@/fixtures/spotify/playlists'
  import { tracks } from '@/fixtures/spotify/tracks'
  import { devices } from '@/fixtures/spotify/devices'
  import type { MusicPlayerInterface } from '@/controllers/MusicPlayerInterface'

  const { controller }: { controller: MusicPlayerInterface } = $props()
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

{#snippet renderTrack(track: Spotify.Track)}
  <div
    class="flex flex-row items-center py-1 px-2 hover:bg-zinc-800 cursor-pointer"
  >
    <img
      class="size-10"
      src={track.album.images[0]?.url ?? '/icons/album-cover-placeholder.png'}
      alt="Track cover"
    />
    <div class="flex flex-col ml-2">
      <p>{track.name}</p>
      <p>{track.artists[0].name}</p>
    </div>
  </div>
{/snippet}

<div class="flex flex-row gap-3">
  <ul class="py-2">
    {#each playlists as playlist}
      <li>{@render renderPlaylist(playlist)}</li>
    {/each}
  </ul>
  <ul class="py-2">
    {#each tracks as track}
      <li>{@render renderTrack(track)}</li>
    {/each}
  </ul>
</div>
<TrackFeedback controller={controller} />
<Devices {devices} onActivate={() => {}} />
