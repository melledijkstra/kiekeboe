import { SpotifyApiClient } from "@/api/spotify";
import { acquireTabLock, releaseTabLock } from "@/lock";
import { Logger } from "@/logger";
import { initializeSpotifyPlayer } from "@/modules/spotify/spotify-sdk";
import { spotifyState } from "@/modules/spotify/spotify.state.svelte";
import { AuthClient } from "@/oauth2/auth";
import { SpotifyAuthProvider } from "@/oauth2/providers";
import type { Album, PlaybackState, Playlist, Track } from "MusicPlayer";
import type { ILogger } from "@/interfaces/logger.interface";
import { MemoryCache, MIN_5 } from "@/cache/memory";
import { convertApiPlaybackState, convertPlayerState, convertSpotifyPlaylist, convertSpotifyTrackToMPTrack } from "@/transforms/spotify";
import { BaseMusicController } from "./BaseMusicController";

export class SpotifyController extends BaseMusicController implements ILogger {
  logger: Logger = new Logger('SpotifyController');

  protected authClient: AuthClient = new AuthClient(new SpotifyAuthProvider());
  protected api: SpotifyApiClient = new SpotifyApiClient(this.authClient);
  protected player?: Spotify.Player;
  private cache = new MemoryCache();

  private initialized: boolean = false;
  public isPlayerActive: boolean = false;

  get auth(): AuthClient {
    return this.authClient
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

    if (await acquireTabLock()) {
      this.logger.log('Acquired tab lock');
      await this.initializeSpotifyPlayer(this.authClient)
    }

    this.initialized = true;
  }

  async destroy() {
    super.destroy()
    await releaseTabLock()

    if (this.player) {
      this.player.disconnect()
      delete this.player
    }
  }

  private async retrieveDevices(): Promise<void> {
    const availableDevices = await this.api?.availableDevices()
    if (availableDevices?.length) {
      spotifyState.devices = availableDevices
    }
  }

private async initializeSpotifyPlayer(authClient: AuthClient) {
    const initVolume = this.state.playback.volume / 100; // Spotify SDK expects a value between 0 and 1
    this.player = await initializeSpotifyPlayer(authClient, initVolume)

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

    this.state.playback = convertPlayerState(state, this.state.playback);

    if (!state.paused) {
      this.setupPlaybackLoop(state.position);
    } else {
      this.cancelPlaybackLoop?.()
    }
  }

  async activateDevice(deviceIdToActivate: string) {
    const result = await this.api?.transferPlaybackDevice(deviceIdToActivate)
    if (result) {
      this.logger.log(`Playback device transferred to ${deviceIdToActivate}`);
      if (spotifyState.deviceId === deviceIdToActivate) {
        this.isPlayerActive = true;
      } else {
        this.isPlayerActive = false;
        this.syncState()
      }
      spotifyState.devices = spotifyState.devices.map(device => ({
        ...device,
        is_active: device.id === deviceIdToActivate
      }))
    }
  }

  async playItem(mediaItem: Playlist | Album | Track) {
    this.logger.log('Playing item:', mediaItem.title, mediaItem)
    this.api.play(mediaItem.uri)
  }

  async play() {
    this.logger.log('Resuming playback', { isPlayerActive: this.isPlayerActive });
    if (this.isPlayerActive) {
      await this.player?.resume()
    } else {
      await this.api.play()
    }
    super.play()
  }

  async pause() {
    this.logger.log('Pausing playback', { isPlayerActive: this.isPlayerActive });
    if (this.isPlayerActive) {
      await this.player?.pause()
    } else {
      await this.api?.pause()
    }
    super.pause()
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
    this.logger.log('Setting volume', volume)
    if (this.isPlayerActive) {
      await this.player?.setVolume(volume / 100)
    } else {
      await this.api.setVolume(volume)
    }
    super.setVolume(volume)
  }

  async seek(position: number) {
    console.log('Seeking to position:', position, this.isPlayerActive)
    if (this.isPlayerActive) {
      await this.player?.seek(position)
    } else {
      await this.api.seek(position)
      // manually update state since we won't get a state change event
      this.state.playback.position_ms = position
      this.setupPlaybackLoop()
    }
    super.seek(position)
  }

  trackEnded(): void {
    this.getPlaybackState()
  }

  async getPlaybackState(): Promise<PlaybackState> {
    this.logger.log('Retrieving Spotify playback state', {
      isPlayerActive: this.isPlayerActive,
    });
    if (this.isPlayerActive && this.player) {
      const playbackState = await this.player.getCurrentState()
      if (playbackState) {
        return convertPlayerState(playbackState, this.state.playback)
      }
    }

    this.logger.log('User is not playing music through the Web SDK, trying to retrieve from Web API');
    const playbackState = await this.api?.getPlaybackState()
    if (playbackState) {
      this.logger.log('Playback state retrieved from Web API', playbackState);
      return convertApiPlaybackState(playbackState)
    } else {
      throw new Error('No playback state available from Web API');
    }
  }

  async syncState() {
    this.logger.log('Syncing Spotify state');
    try {
      const playbackState = await this.getPlaybackState();
      this.state.playback = playbackState;
      if (playbackState.isPlaying) {
        this.setupPlaybackLoop();
      } else {
        this.cancelPlaybackLoop?.();
      }
    } catch(error) {
      this.logger.warn('Failed to sync Spotify state', error);
    }
  }

  async toggleShuffle(forceState?: boolean): Promise<void> {
    const newState = typeof forceState === 'boolean'
    ? forceState
    : !this.state.playback.shuffle;
    this.logger.log('Toggling shuffle mode', { newState });
    await this.api?.toggleShuffle(newState);
    this.getPlaybackState()
  }
}