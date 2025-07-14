
declare module 'MusicPlayer' {
  type Artist = {
    id: string;
    uri: string;
    name: string;
    type: 'artist';
  }

  type Track = {
    id: string;
    uri: string;
    title: string;
    artist: Artist;
    album: Album;
    duration_ms: number; // in milliseconds
    coverArtUrl?: string; // optional
    type: 'track'
  }

  type Album = {
    id: string;
    uri: string;
    title: string;
    artist?: Artist;
    releaseDate?: string; // ISO date string
    coverArtUrl?: string; // optional
    type: 'album'
  }

  type Playlist = {
    id: string;
    uri: string;
    title: string;
    description?: string; // optional
    coverArtUrl?: string; // optional
    type: 'playlist'
  }

  interface MusicPlayerInterface {
    state: {
      playback: PlaybackState
    };
    hasLockAcquired(): boolean;
    getPlaylistItems(playlist: Playlist): Promise<Track[]>;
    playItem(item: Track | Playlist | Album): void;
    getPlaylists(): Promise<Playlist[]>;
    play(mediaItem?: Track | Playlist | Album): void;
    pause(): void;
    next(): void;
    previous(): void;
    seek(position_ms: number): Promise<void>;
    initialize?(): Promise<void>;
    destroy?(): void;
    setVolume(volume: number): void;
    getPlaybackState(): Promise<PlaybackState>;
    activateDevice?(deviceId: string): void;
  }

  type PlaybackState = {
    currentItem?: Track;
    isPlaying: boolean;
    volume: number; // 0-100
    position_ms: number; // in milliseconds
    shuffle: boolean;
  }
}
