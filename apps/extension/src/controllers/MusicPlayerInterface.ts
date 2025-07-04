export interface MusicPlayerInterface {
  switchRepeatMode(repeatMode: string | number): Promise<void>;
  retrievePlaybackState(): Promise<Spotify.PlaybackState | undefined>;
  initialize(): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  togglePlayPause(): Promise<void>;
  nextTrack(): Promise<void>;
  previousTrack(): Promise<void>;
  setVolume(volume: number): Promise<void>;
  seek(position: number): Promise<void>;
  toggleShuffle(shuffle: boolean): Promise<void>;
}
