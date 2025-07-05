import type { Track, PlaybackState } from 'SpotifyApi';
import type { MediaItem } from 'MusicPlayer';

export function trackToMediaItem(track: Track): MediaItem {
  return {
    id: track.id,
    title: track.name,
    artist: {
      id: track.artists[0].id,
      name: track.artists[0].name
    },
    album: {
      id: track.album.id,
      title: track.album.name,
      artist: {
        id: track.album.artists[0].id,
        name: track.album.artists[0].name
      },
      releaseDate: track.album.release_date,
      coverArtUrl: track.album.images[0]?.url
    },
    duration: Math.floor(track.duration_ms / 1000),
    coverArtUrl: track.album.images[0]?.url
  };
}

export function playerPlaybackStateToApiPlaybackState(
  playbackState: Spotify.PlaybackState
): PlaybackState {
  return {
    is_playing: playbackState.paused ? false : true,
    progress_ms: playbackState.position,
    device: {
      id: '',
      is_active: false,
      is_private_session: false,
      is_restricted: false,
      name: '',
      type: '',
      volume_percent: 0,
      supports_volume: false
    },
    repeat_state: '',
    shuffle_state: false,
    context: {
      type: '',
      href: '',
      external_urls: {
        spotify: ''
      },
      uri: ''
    },
    timestamp: 0,
    item: {
      album: {
        album_type: 0,
        total_tracks: 0,
        available_markets: [],
        external_urls: {
          spotify: ''
        },
        href: '',
        id: '',
        images: [],
        name: '',
        release_date: '',
        release_date_precision: '',
        restrictions: {
          reason: ''
        },
        type: 'album',
        uri: '',
        artists: []
      },
      artists: [],
      disc_number: 0,
      duration_ms: 0,
      explicit: false,
      external_ids: {
        isrc: '',
        ean: '',
        upc: ''
      },
      external_urls: {
        spotify: ''
      },
      href: '',
      id: '',
      is_playable: false,
      restrictions: {
        reason: ''
      },
      name: '',
      popularity: 0,
      preview_url: '',
      track_number: 0,
      uri: '',
      is_local: false,
      type: 'track',
      available_markets: ['ES']
    },
    currently_playing_type: '',
    actions: {
      interrupting_playback: false,
      pausing: false,
      resuming: false,
      seeking: false,
      skipping_next: false,
      skipping_prev: false,
      toggling_repeat_context: false,
      toggling_shuffle: false,
      toggling_repeat_track: false,
      transferring_playback: false
    }
  };
}

export function apiPlaybackStateToPlayerPlaybackState(
  playbackState?: PlaybackState
): Spotify.PlaybackState | undefined {
  if (!playbackState) {
    return;
  }

  return {
    paused: !playbackState.is_playing,
    position: playbackState.progress_ms,
    shuffle: playbackState.shuffle_state,
    context: {
      metadata: null,
      uri: null
    },
    disallows: {},
    duration: 0,
    loading: false,
    timestamp: 0,
    repeat_mode: 0,
    playback_id: '',
    playback_quality: '',
    playback_features: {
      hifi_status: ''
    },
    restrictions: {},
    track_window: {
      current_track: {
        album: playbackState.item.album,
        artists: [],
        duration_ms: 0,
        id: null,
        is_playable: false,
        name: '',
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
      previous_tracks: [],
      next_tracks: []
    }
  }
}
