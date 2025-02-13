<script lang="ts">
  import type { Device } from '@/api/definitions/spotify'
  import Card from '../Card.svelte'
  import Devices from './Devices.svelte'
  import TrackFeedback from './TrackFeedback.svelte'
  import { playbackState } from '@/fixtures/spotify/playback'

  type Playlist = {
    name: string
  }

  const playlists: Playlist[] = [
    { name: 'Playlist 1' },
    { name: 'Playlist 2' },
    { name: 'Playlist 3' }
  ]

  const devices: Device[] = [
    {
      id: '1',
      is_active: true,
      is_private_session: false,
      is_restricted: false,
      name: 'Iphone',
      type: 'Smartphone',
      volume_percent: 70,
      supports_volume: false
    },
    {
      id: '2',
      is_active: false,
      is_private_session: false,
      is_restricted: false,
      name: 'Web Player (Spotify)',
      type: 'Computer',
      volume_percent: 34,
      supports_volume: true
    }
  ]

  const tracks: Spotify.Track[] = [
    {
      name: 'Track 1',
      artists: [
        {
          name: 'Artist 1',
          uri: '',
          url: ''
        }
      ],
      album: {
        name: 'Album 1',
        uri: '',
        images: []
      },
      duration_ms: 0,
      id: null,
      is_playable: false,
      uid: '',
      uri: '',
      media_type: 'audio',
      type: 'track',
      track_type: 'audio',
      linked_from: {
        uri: null,
        id: null
      }
    },
    {
      name: 'Track 2',
      artists: [
        {
          name: 'Artist 2',
          uri: '',
          url: ''
        }
      ],
      album: {
        name: 'Album 2',
        uri: '',
        images: []
      },
      duration_ms: 0,
      id: null,
      is_playable: false,
      uid: '',
      uri: '',
      media_type: 'audio',
      type: 'track',
      track_type: 'audio',
      linked_from: {
        uri: null,
        id: null
      }
    },
    {
      name: 'Track 3',
      artists: [
        {
          name: 'Artist 3',
          uri: '',
          url: ''
        }
      ],
      album: {
        name: 'Album 3',
        uri: '',
        images: []
      },
      duration_ms: 0,
      id: null,
      is_playable: false,
      uid: '',
      uri: '',
      media_type: 'audio',
      type: 'track',
      track_type: 'audio',
      linked_from: {
        uri: null,
        id: null
      }
    }
  ]
</script>

{#snippet renderPlaylist(playlist: Playlist)}
  <div
    class="flex flex-row items-center py-1 px-2 hover:bg-zinc-800 cursor-pointer"
  >
    <img
      class="size-10"
      src="https://placehold.co/300x300/orange/white"
      alt="Playlist cover"
    />
    <div class="flex flex-col ml-2">
      <p>{playlist.name}</p>
      <p>{Math.round(Math.random() * 200)} songs</p>
    </div>
  </div>
{/snippet}

{#snippet renderTrack(track: Spotify.Track)}
  <div
    class="flex flex-row items-center py-1 px-2 hover:bg-zinc-800 cursor-pointer"
  >
    <img
      class="size-10"
      src="https://placehold.co/300x300/orange/white"
      alt="Track cover"
    />
    <div class="flex flex-col ml-2">
      <p>{track.name}</p>
      <p>{track.artists[0].name}</p>
    </div>
  </div>
{/snippet}

<Card class="w-2xl" nopadding theme="dark">
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
  <TrackFeedback {playbackState} position={37573} />
  <Devices {devices} onActivate={() => {}} />
</Card>
