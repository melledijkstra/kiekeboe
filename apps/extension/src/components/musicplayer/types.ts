
declare module 'MusicPlayer' {
  type Artist = {
    id: string;
    name: string;
  }

  type Track = {
    id: string;
    title: string;
    artist: Artist;
    album: Album;
    duration_ms: number; // in milliseconds
    coverArtUrl?: string; // optional
  }

  type Album = {
    id: string;
    title: string;
    artist: Artist;
    releaseDate?: string; // ISO date string
    coverArtUrl?: string; // optional
  }

  type Playlist = {
    id: string;
    title: string;
    description?: string; // optional
    tracks: Track[];
    coverArtUrl?: string; // optional
  }

  interface MusicPlayerInterface {
    getPlaylists(): Promise<Playlist[]>;
    play(mediaItem?: Track | Playlist | Album): void;
    pause(): void;
    next(): void;
    previous(): void;
    seek(position_ms: number): Promise<void>;
    initialize?(): Promise<void>;
    setVolume(volume: number): void;
    getState(): Promise<State>;
    activateDevice?(deviceId: string): void;
  }

  type State = {
    currentItem?: Track;
    isPlaying: boolean;
    volume: number; // 0-100
    position_ms: number; // in milliseconds
    shuffle: boolean;
  }
}
