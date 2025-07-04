import type { Track } from 'SpotifyApi';
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
