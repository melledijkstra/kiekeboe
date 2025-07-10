import { SpotifyApiClient } from "@/api/spotify";
import { acquireTabLock, lockExists, releaseTabLock } from "@/lock";
import { Logger } from "@/logger";
import { initializeSpotifyPlayer } from "@/modules/spotify/spotify-sdk";
import { spotifyState } from "@/modules/spotify/spotify.state.svelte";
import { AuthClient } from "@/oauth2/auth";
import { SpotifyAuthProvider } from "@/oauth2/providers";
import { playbackLoop } from "@/time/utils";
import type { Album, MusicPlayerInterface, Playlist, State, Track } from "MusicPlayer";
import type { ILogger } from "@/interfaces/logger.interface";
import { MPState } from "@/components/musicplayer/state.svelte";
import { MemoryCache, MIN_5 } from "@/cache/memory";
import { convertApiPlayerState, convertPlayerState, convertSpotifyPlaylist, convertSpotifyTrackToMPTrack } from "@/transforms/spotify";

export class SpotifyController implements ILogger, MusicPlayerInterface {
  logger: Logger = new Logger('SpotifyController');

  private authClient: AuthClient = new AuthClient(new SpotifyAuthProvider());
  public api: SpotifyApiClient = new SpotifyApiClient(this.authClient);
  public player?: Spotify.Player;
  private cache = new MemoryCache();

  private initialized: boolean = false;
  public isPlayerActive: boolean = false;
  static hasLock: boolean = false;

  private static cancelPlaybackLoop?: () => void;

  constructor() {
    SpotifyController.hasLock = acquireTabLock();
  }

  async getPlaylistItems(playlist: Playlist): Promise<Track[]> {
    const tracks = await this.api.getPlaylistItems(playlist.id)
    return tracks.map(convertSpotifyTrackToMPTrack)
  }

  async getPlaylists(): Promise<Playlist[]> {
    const cached = this.cache.get<Playlist[]>('playlists')
    if (cached) {
      return cached
    }
    try {
      const playlists = await this.api.userPlaylists()
      const converted = playlists.map(convertSpotifyPlaylist)
      this.cache.set('playlists', converted, MIN_5) // Cache for 5 minutes
      return converted
    } catch(error) {
      this.logger.error('Failed to retrieve playlists', error);
    }

    return [];
  }

  async switchRepeatMode(repeatMode: string | number): Promise<void> {
    if (!this.api) {
      throw new Error('Spotify API client is not initialized');
    }
    return await this.api?.toggleRepeatMode(repeatMode)
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
      this.isPlayerActive = false
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
      this.isPlayerActive = false
      return
    }

    this.logger.log('playerStateChanged: Playback state changed', state);

    MPState.state = convertPlayerState(state);

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

  async setupPlaybackLoop(state: State) {
    if (SpotifyController.cancelPlaybackLoop) {
      this.logger.log('Playback loop already set up, cancelling previous loop');
      SpotifyController.cancelPlaybackLoop();
    }

    SpotifyController.cancelPlaybackLoop = playbackLoop(
      (pos) => this.updatePosition(pos),
      1000, // Update every second
      state.position_ms
    )
  }

  async activateDevice(deviceIdToActivate: string) {
    const result = await this.api?.transferPlaybackDevice(deviceIdToActivate)
    if (result) {
      this.logger.log(`Playback device transferred to ${deviceIdToActivate}`);
      if (spotifyState.deviceId === deviceIdToActivate) {
        this.isPlayerActive = true;
      }
      spotifyState.devices = spotifyState.devices.map(device => ({
        ...device,
        is_active: device.id === deviceIdToActivate
      }))
    }
  }

  private updatePosition(position: number) {
    MPState.state.position_ms = position
  }

  async playItem(mediaItem: Playlist | Album | Track) {
    this.logger.log('Playing item:', mediaItem.title, mediaItem)
    this.api.play(mediaItem.uri);
  }

  async play() {
    this.logger.log('Resuming playback', { isPlayerActive: this.isPlayerActive });
    if (this.isPlayerActive) {
      await this.player?.resume()
    } else {
      await this.api.play()
      MPState.state.isPlaying = true
    }
  }

  async pause() {
    this.logger.log('Pausing playback', { isPlayerActive: this.isPlayerActive });
    if (this.isPlayerActive) {
      await this.player?.pause()
    } else {
      await this.api?.pause()
      // manually update state since we won't get a state change event
      MPState.state.isPlaying = false
    }
  }

  async next() {
    if (this.isPlayerActive) {
      await this.player?.nextTrack()
    } else {
      await this.api.nextTrack()
      this.syncState()
    }
  }

  async previous() {
    if (this.isPlayerActive) {
      await this.player?.previousTrack()
    } else {
      await this.api.previousTrack()
      this.syncState()
    }
  }

  async setVolume(volume: number) {
    await this.player?.setVolume(volume)
  }

  async seek(position: number) {
    console.log('Seeking to position:', position, this.isPlayerActive);
    if (this.isPlayerActive) {
      await this.player?.seek(position)
    } else {
      await this.api.seek(position)
      // manually update state since we won't get a state change event
      MPState.state.position_ms = position;
      this.setupPlaybackLoop(MPState.state);
    }
  }

  async getState(): Promise<State> {
    this.logger.log('Retrieving Spotify playback state', {
      isPlayerActive: this.isPlayerActive,
    });
    if (this.isPlayerActive && this.player) {
      const playbackState = await this.player.getCurrentState()
      if (playbackState) {
        return convertPlayerState(playbackState)
      }
    }

    this.logger.log('User is not playing music through the Web SDK, trying to retrieve from Web API');
    const playbackState = await this.api?.getPlaybackState()
    if (playbackState) {
      this.logger.log('Playback state retrieved from Web API', playbackState);
      return convertApiPlayerState(playbackState)
    } else {
      this.logger.log('No playback state available from Web API');
      return {
        isPlaying: false,
        volume: 0,
        position_ms: 0,
        shuffle: false,
        currentItem: undefined
      }
    }
  }

  async syncState() {
    this.logger.log('Syncing Spotify state');
    const state = await this.getState();
    MPState.state = state;
    if (state.isPlaying) {
      this.setupPlaybackLoop(state);
    } else {
      SpotifyController.cancelPlaybackLoop?.();
    }
  }

  async toggleShuffle(shuffle: boolean): Promise<void> {
    await this.api?.toggleShuffle(shuffle)
  }
}