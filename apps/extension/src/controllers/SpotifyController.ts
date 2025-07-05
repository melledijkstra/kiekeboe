import { SpotifyApiClient } from "@/api/spotify";
import { acquireTabLock, lockExists, releaseTabLock } from "@/lock";
import { Logger } from "@/logger";
import { initializeSpotifyPlayer } from "@/modules/spotify/spotify-sdk";
import { spotifyState } from "@/modules/spotify/spotify.store.svelte";
import { AuthClient } from "@/oauth2/auth";
import { SpotifyAuthProvider } from "@/oauth2/providers";
import { playbackLoop } from "@/time/utils";
import type { MusicPlayerInterface } from "./MusicPlayerInterface";
import type { ILogger } from "@/interfaces/logger.interface";
import type { Track } from "SpotifyApi";
import { playerPlaybackStateToApiPlaybackState } from "@/transforms/spotify";

export class SpotifyController implements ILogger, MusicPlayerInterface {
  logger: Logger = new Logger('SpotifyController');

  private authClient: AuthClient = new AuthClient(new SpotifyAuthProvider());
  public api?: SpotifyApiClient = new SpotifyApiClient(this.authClient);
  public player?: Spotify.Player;

  private initialized: boolean = false;
  public isPlayerActive: boolean = false;
  static hasLock: boolean = false;

  private static cancelPlaybackLoop?: () => void;

  constructor() {
    SpotifyController.hasLock = acquireTabLock();
  }

  switchRepeatMode(repeatMode: string | number): Promise<void> {
    if (!this.api) {
      throw new Error('Spotify API client is not initialized');
    }
    return this.api?.toggleRepeatMode(repeatMode)
  }

  async togglePlayPause(): Promise<void> {
    if (spotifyState.deviceId && this.player) {
      return this.player.togglePlay()
    }
  }

  async initialize() {
    if (this.initialized) {
      this.logger.log('SpotifyController is already initialized');
      return;
    }

    if (SpotifyController.hasLock) {
      await this.initializeSpotifyPlayer(this.authClient)
    }
    this.initialized = true;
  }

  destroy() {
    releaseTabLock()

    SpotifyController.cancelPlaybackLoop?.()

    if (this.player) {
      this.player.disconnect()
      delete this.player
    }
  }

  static lockExists(): boolean {
    return lockExists();
  }

  static hasLockAcquired(): boolean {
    return SpotifyController.hasLock;
  }

  private async retrieveDevices(): Promise<void> {
    const availableDevices = await this.api?.availableDevices()
    if (availableDevices?.length) {
      spotifyState.devices = availableDevices
    }
  }

  private async initializeSpotifyPlayer(authClient: AuthClient) {
    this.player = await initializeSpotifyPlayer(authClient)

    this.player.addListener('ready', async ({ device_id }) => {
      this.logger.log(`Ready with Device ID: %c${device_id}`, 'font-style: italic; color: lightgreen;')
      spotifyState.deviceId = device_id

      this.retrieveDevices()
    })

    this.player.addListener('not_ready', ({ device_id }) => {
      this.logger.log('device ID has gone offline', device_id)
      delete spotifyState.deviceId
    })

    this.player.addListener('player_state_changed', (state) => this.playerStateChanged(state))

    this.player.addListener('playback_error', ({ message }) => {
      console.error('Playback error', message)
    })

    this.player.connect().then((success) => {
      if (!success) {
        throw new Error('Failed to connect')
      } else {
        this.logger.log('Connected to Spotify Web Playback SDK')
      }
    })
  }

  async playerStateChanged(state: Spotify.PlaybackState) {
    if (!state) {
      this.logger.log('playerStateChanged: No playback state available');
      if (spotifyState.deviceId) {
        delete spotifyState.deviceId
      }
      return
    }

    this.logger.log('playerStateChanged: Playback state changed', state);

    spotifyState.playbackState = playerPlaybackStateToApiPlaybackState(state)

    if (!state.paused) {
      if (SpotifyController.cancelPlaybackLoop) {
        SpotifyController?.cancelPlaybackLoop();
      }
      SpotifyController.cancelPlaybackLoop = playbackLoop(
        (pos) => this.updatePosition(pos),
        1000, // Update every second
        state.position
      )
    } else {
      SpotifyController.cancelPlaybackLoop?.()
    }
  }

  async activateDevice(deviceIdToActivate: string) {
    const result = await this.api?.transferPlaybackDevice(deviceIdToActivate)
    if (result && spotifyState.deviceId === deviceIdToActivate) {
      spotifyState.devices = spotifyState.devices.map(device => ({
        ...device,
        is_active: device.id === deviceIdToActivate
      }))
    }
  }

  private updatePosition(position: number) {
    spotifyState.position = position
  }

  async getCurrentTrack(): Promise<Track> {
    // await this.apiClient?.getCurrentTrack()
    throw new Error('Method not implemented.');
  }

  async play() {
    await this.player?.resume()
  }

  async pause() {
    await this.player?.pause()
  }

  async nextTrack() {
    await this.player?.nextTrack()
  }

  async previousTrack() {
    await this.player?.previousTrack()
  }

  async setVolume(volume: number) {
    await this.player?.setVolume(volume)
  }

  async seek(position: number) {
    await this.player?.seek(position)
  }

  async retrievePlaybackState(): Promise<Spotify.PlaybackState | undefined> {
    const playbackState = await this.player?.getCurrentState()
 
    if (playbackState) {
      spotifyState.playbackState = playerPlaybackStateToApiPlaybackState(playbackState)
    } else {
      this.logger.log('retrievePlaybackState: user is not playing music through the Web SDK, trying to retrieve from Web API');
      const playbackState = await this.api?.getPlaybackState()
      if (playbackState) {
        this.logger.log('retrievePlaybackState: Playback state retrieved from Web API', playbackState);
        // spotifyState.playbackState = playbackState
        // return playbackState
        return
      } else {
        this.logger.log('retrievePlaybackState: No playback state available from Web API');
        return
      }
    }
  }

  async toggleShuffle(shuffle: boolean): Promise<void> {
    await this.api?.toggleShuffle(shuffle)
  }
}