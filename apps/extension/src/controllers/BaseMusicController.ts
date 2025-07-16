import type { ILogger } from "@/interfaces/logger.interface";
import { Logger } from "@/logger";
import { playbackLoop } from "@/time/utils";
import type { Album, MusicPlayerInterface, Playlist, PlaybackState, Track } from "MusicPlayer";

export abstract class BaseMusicController implements MusicPlayerInterface, ILogger {
  logger: Logger = new Logger('BaseMusicController');

  constructor(public state: { playback: PlaybackState }) {}

  protected cancelPlaybackLoop?: () => void
  
  abstract playItem(item: Track | Playlist | Album): Promise<void>;
  abstract hasLockAcquired(): boolean
  abstract getPlaylistItems(playlist: Playlist): Promise<Track[]>
  abstract getPlaylists(): Promise<Playlist[]>
  abstract next(): void
  abstract previous(): void
  abstract initialize?(): Promise<void>
  abstract activateDevice?(deviceId: string): void
  abstract getPlaybackState(): Promise<PlaybackState>
  abstract toggleShuffle(enabled?: boolean): Promise<void>
  
  protected trackEnded() {
    this.stopPlaybackLoop()
  }

  play() {
    if (this.state.playback.isPlaying) {
      return
    }
    this.state.playback.isPlaying = true
    this.setupPlaybackLoop()
  }

  pause() {
    if (!this.state.playback.isPlaying) {
      return
    }
    this.state.playback.isPlaying = false
    this.stopPlaybackLoop()
  }

  destroy(): void {
    this.stopPlaybackLoop()
  }

  async setupPlaybackLoop(initialPos?: number) {
    if (this.cancelPlaybackLoop) {
      this.logger.log('Playback loop already set up, cancelling previous loop')
      this.cancelPlaybackLoop()
    }

    this.cancelPlaybackLoop = playbackLoop(
      () => this.updatePosition(),
      1000, // Update every second
      initialPos ?? this.state.playback.position_ms
    )
  }

  protected stopPlaybackLoop() {
    this.cancelPlaybackLoop?.()
    delete this.cancelPlaybackLoop
  }

  protected stop() {
    this.stopPlaybackLoop()
    delete this.state.playback.currentItem
    this.state.playback.isPlaying = false
    this.state.playback.position_ms = 0
  }

  protected updatePosition() {
    const newPos = this.state.playback.position_ms + 1000
    if (this.state.playback.currentItem) {
      if (newPos >= this.state.playback?.currentItem.duration_ms) {
        this.logger.log('Track ended, resetting position.')
        this.stopPlaybackLoop()
        this.trackEnded()
        return
      }
    } else {
      this.stopPlaybackLoop()
    }
    if (this.state.playback.isPlaying) {
      this.state.playback.position_ms = newPos // Increment position by 1 second
    }
  }

  async seek(position: number): Promise<void> {
    if(position < 0) {
      this.state.playback.position_ms = 0
    }

    if (this.state.playback.currentItem && position > this.state.playback.currentItem.duration_ms) {
      this.state.playback.position_ms = this.state.playback.currentItem.duration_ms
    }

    this.state.playback.position_ms = position
  }

  async setVolume(volume: number): Promise<void> {
    this.state.playback.volume = volume
  }
}
