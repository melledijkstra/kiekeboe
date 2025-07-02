import { fn } from '@storybook/test'
import type { MusicPlayerInterface } from '@/controllers/MusicPlayerInterface';

export class MockMusicPlayerController implements MusicPlayerInterface {
  constructor() {

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
