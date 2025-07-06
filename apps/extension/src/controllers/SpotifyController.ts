import { SpotifyApiClient } from "@/api/spotify";
import type { PlaybackState } from "SpotifyApi";
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
import { MemoryCache, MIN_1 } from "@/cache/memory";
import { convertSpotifyPlaylist } from "@/transforms/spotify";

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

  async getPlaylists(): Promise<Playlist[]> {
    const cached = this.cache.get<Playlist[]>('playlists')
    if (cached) {
      return cached
    } else {
      const playlists = await this.api.userPlaylists()
      const converted = playlists.map(convertSpotifyPlaylist)
      this.cache.set('playlists', converted, MIN_1) // Cache for 5 minutes
      return converted
    }
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

    MPState.state = this.convertPlayerState(state);

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
      this.logger.log('Playback loop already set up, skipping');
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
    this.api.play(mediaItem.id)
  }

  async play() {
    if (this.isPlayerActive) {
      await this.player?.resume()
    } else {
      await this.api.play()
    }
  }

  async pause() {
    if (this.isPlayerActive) {
      await this.player?.pause()
    } else {
      await this.api?.pause()
    }
  }

  async next() {
    await this.player?.nextTrack()
  }

  async previous() {
    await this.player?.previousTrack()
  }

  async setVolume(volume: number) {
    await this.player?.setVolume(volume)
  }

  async seek(position: number) {
    console.log('Seeking to position:', position, this.isPlayerActive);
    if (this.isPlayerActive) {
      await this.player?.seek(position)
    }
  }

  private convertPlayerState(state: Spotify.PlaybackState): State {
    const currentTrack = state.track_window.current_track;
    const album = currentTrack.album;
    const artists = currentTrack.artists;
    const mainArtist = artists[0];
    return {
      isPlaying: !state.paused,
      volume: 0,
      position_ms: state.position,
      shuffle: false,
      currentItem: {
        id: currentTrack.id ?? currentTrack.uri,
        title: currentTrack.name,
        duration_ms: currentTrack.duration_ms,
        artist: {
          id: mainArtist.uri,
          name: mainArtist.name
        },
        album: {
          id: album.uri,
          title: album.name,
          artist: {
            id: mainArtist.uri,
            name: mainArtist.name
          },
          coverArtUrl: album.images[0]?.url
        },
      }
    }
  }

  private convertApiPlayerState(state: PlaybackState): State {
    const track = state.item
    const device = state.device
    const album = track.album
    return {
      isPlaying: state.is_playing,
      volume: device.volume_percent ?? 0,
      position_ms: state.progress_ms,
      shuffle: state.shuffle_state,
      currentItem: {
        id: track.id,
        title: track.name,
        duration_ms: track.duration_ms,
        artist: {
          id: track.artists?.[0]?.uri ?? '',
          name: track.artists?.[0]?.name ?? ''
        },
        album: {
          id: album.id,
          title: album.name,
          artist: {
            id: album.artists?.[0]?.uri ?? '',
            name: album.artists?.[0]?.name ?? ''
          },
          coverArtUrl: album.images[0]?.url ?? ''
        },
      },
    }
  }

  async getState(): Promise<State> {
    if (this.isPlayerActive && this.player) {
      const playbackState = await this.player.getCurrentState()
      if (playbackState) {
        return this.convertPlayerState(playbackState)
      }
    }

    this.logger.log('User is not playing music through the Web SDK, trying to retrieve from Web API');
    const playbackState = await this.api?.getPlaybackState()
    if (playbackState) {
      this.logger.log('Playback state retrieved from Web API', playbackState);
      return this.convertApiPlayerState(playbackState)
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