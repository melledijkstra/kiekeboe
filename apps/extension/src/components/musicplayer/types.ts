
declare module 'MusicPlayer' {
  type Artist = {
    id: string;
    name: string;
  }

  type MediaItem = {
    id: string;
    title: string;
    artist: Artist;
    album: Album;
    duration: number; // in seconds
    coverArtUrl?: string; // optional
  }

  type Album = {
    id: string;
    title: string;
    artist: Artist;
    releaseDate?: string; // ISO date string
    coverArtUrl?: string; // optional
  }

  export interface MusicPlayer {
    play: (mediaItem: MediaItem) => void;
    pause: () => void;
    stop: () => void;
    next: () => void;
    previous: () => void;
    setVolume: (volume: number) => void;
    getCurrentTrack: () => string | null;
    onTrackChange: (callback: (track: string) => void) => void;
  }
}
