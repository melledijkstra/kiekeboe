import { playlists } from '@/fixtures/musicplayer/playlists';
import { tracks } from '@/fixtures/musicplayer/tracks';
import type { Album, MusicPlayerInterface, Playlist, State, Track } from 'MusicPlayer';

export class MockMusicPlayerController implements MusicPlayerInterface {
  private playbackLoop: NodeJS.Timeout | null = null;

  constructor(public state: State) {}

  async getPlaylistItems(playlist: Playlist): Promise<Track[]> {
    return tracks;
  }

  activateDevice?(deviceId: string): void {
    throw new Error('Method not implemented.');
  }

  playItem(item: Track | Playlist | Album): void {
    console.log('Playing item:', item);
    if (!this.state.isPlaying) {
      this.state.isPlaying = true;
    }
  }

  async delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  async getPlaylists(): Promise<Playlist[]> {
    await this.delay(1000);
    return playlists
  }

  next(): void {
    throw new Error('Method not implemented.');
  }

  previous(): void {
    throw new Error('Method not implemented.');
  }

  async getState(): Promise<State> {
    return this.state
  }
  
  async play() {
    this.state.isPlaying = true
    this.startPlaybackLoop();
  }

  stop() {
    this.stopPlaybackLoop();
    this.state.isPlaying = false; // Stop playback if the track ends
    this.state.position_ms = 0; // Reset position 
  }

  startPlaybackLoop() {
    if (this.playbackLoop) return; // Prevent multiple loops
    this.playbackLoop = setInterval(() => {
      const newPos = this.state.position_ms + 1000; // Increment position by 1 second
      if (this.state.currentItem) {
        if (newPos >= this.state?.currentItem?.duration_ms) {
          console.log('Track ended, resetting position.');
          this.stop();
        }
      } else {
        this.stopPlaybackLoop();
      }
      if (this.state.isPlaying) {
        this.state.position_ms += 1000; // Increment position by 1 second
      }
    }, 1000);
  }

  stopPlaybackLoop() {
    if (this.playbackLoop) {
      clearInterval(this.playbackLoop);
      this.playbackLoop = null;
    }
  }
  
  async pause() {
    this.state.isPlaying = false
    this.stopPlaybackLoop()
  }
  
  async setVolume(volume: number): Promise<void> {
    this.state.volume = Math.max(0, Math.min(100, volume)); // Ensure volume is between 0 and 100
  }
  
  async seek(position: number): Promise<void> {
    if(position < 0) {
      this.state.position_ms = 0;
    }

    if (this.state.currentItem && position > this.state.currentItem.duration_ms) {
      this.state.position_ms = this.state.currentItem.duration_ms;
    }

    this.state.position_ms = position;
  }
}
