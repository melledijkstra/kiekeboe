import type {
  Artist as SpotifyArtist,
  Track as SpotifyTrack,
  PlaybackState as ApiPlaybackState,
  Playlist as SpotifyPlaylist
} from 'SpotifyApi';
import type { Playlist, PlaybackState, Track, Album, Artist } from 'MusicPlayer';

export function convertAlbumToMPAlbum(album: SpotifyTrack['album']): Album {
  const artist = album.artists?.[0];
  return {
    id: album.id,
    uri: album.uri,
    title: album.name,
    artist: artist && convertSpotifyArtistToMPArtist(artist),
    releaseDate: album.release_date,
    coverArtUrl: album.images?.[0]?.url,
    type: 'album'
  }
}

export function convertSpotifyArtistToMPArtist(artist: SpotifyArtist): Artist {
  return {
  id: artist.id,
  uri: artist.uri,
  name: artist.name,
  type: 'artist'
}
}

export function convertSpotifyTrackToMPTrack(track: SpotifyTrack): Track {
  const mainArtist = track.artists?.[0];
  return {
    id: track.id,
    uri: track.uri,
    title: track.name,
    artist: mainArtist && convertSpotifyArtistToMPArtist(mainArtist),
    album: convertAlbumToMPAlbum(track.album),
    duration_ms: track.duration_ms,
    coverArtUrl: track.album.images?.[0]?.url,
    type: 'track'
  };
}

export const convertSpotifyPlaylist = (playlist: SpotifyPlaylist): Playlist => ({
  id: playlist.id,
  uri: playlist.uri,
  title: playlist.name,
  description: playlist.description || '',
  tracks: [],
  coverArtUrl: playlist.images[0]?.url || '',
  type: 'playlist'
})

export const convertApiPlayerState = (state: ApiPlaybackState): PlaybackState => {
  const track = state.item
  const device = state.device
  return {
    isPlaying: state.is_playing,
    volume: device.volume_percent ?? 0,
    position_ms: state.progress_ms,
    shuffle: state.shuffle_state,
    currentItem: convertSpotifyTrackToMPTrack(track),
  }
}

export const convertPlayerState = (state: Spotify.PlaybackState): PlaybackState => {
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
      id: currentTrack.uri,
      uri: currentTrack.uri,
      title: currentTrack.name,
      duration_ms: currentTrack.duration_ms,
      artist: {
        id: mainArtist.uri,
        uri: mainArtist.uri,
        name: mainArtist.name,
        type: 'artist'
      },
      album: {
        id: album.uri,
        uri: album.uri,
        title: album.name,
        artist: {
          id: mainArtist.uri,
          uri: mainArtist.uri,
          name: mainArtist.name,
          type: 'artist'
        },
        coverArtUrl: album.images[0]?.url,
        type: 'album'
      },
      type: 'track'
    }
  }
}
