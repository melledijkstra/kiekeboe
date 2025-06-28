export interface MusicPlayerInterface {
  retrievePlaybackState(): Promise<Spotify.PlaybackState | undefined>;
  initialize(): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  nextTrack(): Promise<void>;
  previousTrack(): Promise<void>;
  setVolume(volume: number): Promise<void>;
  seek(position: number): Promise<void>;
  toggleShuffle(shuffle: boolean): Promise<void>;
}
