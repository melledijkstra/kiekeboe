import { fn } from '@storybook/test'
import type { MusicPlayerInterface, Playlist, State } from 'MusicPlayer';

export class MockMusicPlayerController implements MusicPlayerInterface {
  constructor() {}

  async getPlaylists(): Promise<Playlist[]> {
    const playlists = [];
    for (let i = 0; i < 10; i++) {
      const playlist: Playlist = {
        id: `playlist-${i}`,
        title: `Playlist ${i}`,
        description: `Description for playlist ${i}`,
        tracks: [],
        coverArtUrl: `https://example.com/cover-${i}.jpg`
      };
      playlists.push(playlist);
    }
    return playlists;
  }

  next(): void {
    throw new Error('Method not implemented.');
  }

  previous(): void {
    throw new Error('Method not implemented.');
  }

  getState(): Promise<State> {
    throw new Error('Method not implemented.');
  }

  activateDevice(deviceId: string): void {
    console.log(`Activating device with ID: ${deviceId}`);
    throw new Error('Method not implemented.');
  }

  async switchRepeatMode(repeatMode: string | number): Promise<void> {
    fn(() => repeatMode);
  }

  async togglePlayPause(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async retrievePlaybackState(): Promise<Spotify.PlaybackState | undefined> {
    fn();
    return;
  }

  async initialize(): Promise<void> {
    return
  }
  
  async play(): Promise<void> {
    fn();
  }
  
  async pause(): Promise<void> {
    fn();
  }
  
  async nextTrack(): Promise<void> {
    fn();
  }
  
  async previousTrack(): Promise<void> {
    fn();
  }
  
  async setVolume(volume: number): Promise<void> {
    fn(() => volume);
  }
  
  async seek(position: number): Promise<void> {
    fn(() => position);
  }
  
  async toggleShuffle(shuffle: boolean): Promise<void> {
    fn(() => shuffle);
  }
}

export const mockController = new MockMusicPlayerController();
