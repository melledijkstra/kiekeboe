import { SpotifyClient } from "@/api/spotify";
import { acquireTabLock, lockExists, releaseTabLock } from "@/lock";
import { Logger } from "@/logger";
import { initializeSpotifyPlayer } from "@/modules/spotify/player";
import { spotifyState } from "@/modules/spotify/spotify.store.svelte";
import { AuthClient } from "@/oauth2/auth";
import { playbackLoop } from "@/time/utils";
import type { MusicPlayerInterface } from "./MusicPlayerInterface";
import type { ILogger } from "@/interfaces/logger.interface";

export class SpotifyController implements ILogger, MusicPlayerInterface {
  logger: Logger = new Logger('SpotifyController');

  private authClient: AuthClient = new AuthClient('spotify');
  public api?: SpotifyClient;
  public player?: Spotify.Player;
  static hasLock: boolean = false;
  static deviceId: string | null = null;
  private isActiveDevice: boolean = false;
  private static cancelPlaybackLoop?: () => void;

  constructor() {
    SpotifyController.hasLock = acquireTabLock();
  }

  async initialize() {
    this.authClient.getAuthToken()
    this.api = new SpotifyClient(this.authClient)
    this.initializeSpotifyPlayer(this.authClient)
  }

  destroy() {
    releaseTabLock()

    SpotifyController.cancelPlaybackLoop?.()

    if (this.player) {
      this.player.disconnect()
    }
  }

  static lockExists(): boolean {
    return lockExists();
  }

  static hasLockAcquired(): boolean {
    return SpotifyController.hasLock;
  }

  private async initializeSpotifyPlayer(authClient: AuthClient) {
    const token = await authClient.getAuthToken();
    if (!token) {
      throw new Error('Failed to get Spotify auth token');
    }

    this.player = await initializeSpotifyPlayer(authClient)

    this.player.addListener('ready', async ({ device_id }) => {
      this.logger.log('ready with Device ID', device_id)
      SpotifyController.deviceId = device_id

      const availableDevices = await this.api?.availableDevices()
      if (availableDevices?.length) {
        spotifyState.update((s) => ({
          ...s,
          devices: availableDevices,
        }))
      }
    })

    this.player.addListener('not_ready', ({ device_id }) => {
      this.logger.log('device ID has gone offline', device_id)
      SpotifyController.deviceId = null
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
      if (this.isActiveDevice) {
        this.isActiveDevice = false
      }
      return
    }

    this.logger.log('playerStateChanged: Playback state changed', state);

    spotifyState.update((s) => ({
      ...s,
      playbackState: state,
    }))

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

    this.isActiveDevice = !!(await this.player?.getCurrentState())
  }

  async activateDevice(deviceIdToActivate: string) {
    const result = await this.api?.transferPlaybackDevice(deviceIdToActivate)
    if (result && SpotifyController.deviceId === deviceIdToActivate) {
      this.isActiveDevice = true
    }
  }

  private updatePosition(position: number) {
    spotifyState.position = position
  }

  async getCurrentTrack(): Promise<any> {
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
      spotifyState.playbackState = playbackState
    } else {
      this.logger.log('retrievePlaybackState: user is not playing music through the Web SDK, trying to retrieve from Web API');
      const playbackState = await this.api?.getPlaybackState()
      if (playbackState) {
        spotifyState.playbackState = playbackState
        return playbackState
      } else {
        this.logger.log('retrievePlaybackState: No playback state available from Web API');
        return undefined
      }
    }
  }

  async toggleShuffle(shuffle: boolean): Promise<void> {
    await this.api?.toggleShuffle(shuffle)
  }
}