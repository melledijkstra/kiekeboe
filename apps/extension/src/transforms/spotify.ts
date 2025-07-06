import type {
  Track as SpotifyTrack,
  PlaybackState as ApiPlaybackState,
  Playlist as SpotifyPlaylist
} from 'SpotifyApi';
import type { Playlist, State, Track } from 'MusicPlayer';

export function spotifyTrackToMPTrack(track: SpotifyTrack): Track {
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
    duration_ms: track.duration_ms,
    coverArtUrl: track.album.images[0]?.url
  };
}

export const convertSpotifyPlaylist = (playlist: SpotifyPlaylist): Playlist => ({
  id: playlist.uri,
  title: playlist.name,
  description: playlist.description || '',
  tracks: [],
  coverArtUrl: playlist.images[0]?.url || ''
})

export const convertApiPlayerState = (state: ApiPlaybackState): State => {
  const track = state.item
  const device = state.device
  const album = track.album
  return {
    isPlaying: state.is_playing,
    volume: device.volume_percent ?? 0,
    position_ms: state.progress_ms,
    shuffle: state.shuffle_state,
    currentItem: {
      id: track.id,
      title: track.name,
      duration_ms: track.duration_ms,
      artist: {
        id: track.artists?.[0]?.uri ?? '',
        name: track.artists?.[0]?.name ?? ''
      },
      album: {
        id: album.id,
        title: album.name,
        artist: {
          id: album.artists?.[0]?.uri ?? '',
          name: album.artists?.[0]?.name ?? ''
        },
        coverArtUrl: album.images[0]?.url ?? ''
      },
    },
  }
}

export const convertPlayerState = (state: Spotify.PlaybackState): State => {
  const currentTrack = state.track_window.current_track;
  const album = currentTrack.album;
  const artists = currentTrack.artists;
  const mainArtist = artists[0];
  return {
    isPlaying: !state.paused,
    volume: 0,
    position_ms: state.position,
    shuffle: false,
    currentItem: {
      id: currentTrack.id ?? currentTrack.uri,
      title: currentTrack.name,
      duration_ms: currentTrack.duration_ms,
      artist: {
        id: mainArtist.uri,
        name: mainArtist.name
      },
      album: {
        id: album.uri,
        title: album.name,
        artist: {
          id: mainArtist.uri,
          name: mainArtist.name
        },
        coverArtUrl: album.images[0]?.url
      },
    }
  }
}
