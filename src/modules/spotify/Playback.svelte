<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Logger } from '@/logger'
  import { initializeSpotifyPlayer } from './player'
  import Card from '@/components/Card.svelte'
  import { SpotifyClient } from '@/api/spotify'
  import type { Device } from '@/api/definitions/spotify'
  import { AuthClient } from '@/oauth2/auth'
  import TrackFeedback from '@/components/musicplayer/TrackFeedback.svelte'
  import Devices from '@/components/musicplayer/Devices.svelte'

  const PLAYER_LOCK_FLAG = 'spotifyInitialized'

  let EMPTY: undefined

  const logger = new Logger('spotify')
  const authClient = new AuthClient('spotify')

  const { open, token }: { open: boolean; token: string } = $props()
  let apiClient = $state(new SpotifyClient(token))
  let deviceId = $state<string | null>(null)
  let player = $state<Spotify.Player | null>(null)
  let isActive = $state(false)
  let position = $state(0) // in ms
  let hasLock = $state(false)
  let devices = $state<Device[]>([])
  let playbackState = $state<Spotify.PlaybackState | null>(null)

  let playbackLoop = $state<number>()

  async function playerStateChanged(state: Spotify.PlaybackState) {
    logger.log('state change', state)
    if (!state) {
      if (isActive) {
        isActive = false
      }
      return
    }

    playbackState = state
    position = state.position

    if (!state.paused) {
      if (!playbackLoop) {
        playbackLoop = setInterval(() => {
          position += 1000
        }, 1000)
      }
    } else {
      clearInterval(playbackLoop)
      playbackLoop = EMPTY
    }

    isActive = !!(await player?.getCurrentState())
  }

  async function activateDevice(deviceIdToActivate: string) {
    const result = await apiClient.transferPlaybackDevice(deviceIdToActivate)
    if (deviceId === deviceIdToActivate) {
      isActive = result
    }
  }

  function lock() {
    const lockExists = localStorage.getItem(PLAYER_LOCK_FLAG)
    if (!lockExists) {
      localStorage.setItem(PLAYER_LOCK_FLAG, 'true')
      hasLock = true
    }
  }

  function unlock() {
    if (hasLock) {
      localStorage.removeItem(PLAYER_LOCK_FLAG)
      hasLock = false
    }
  }

  function cleanup() {
    unlock()
    if (player) {
      player.disconnect()
    }
    if (playbackLoop) {
      clearInterval(playbackLoop)
      playbackLoop = EMPTY
    }
    window.removeEventListener('beforeunload', cleanup)
  }

  onMount(async () => {
    window.addEventListener('beforeunload', cleanup)

    if (localStorage.getItem(PLAYER_LOCK_FLAG)) {
      // another tab has already initialized a player before
      return
    }

    player = await initializeSpotifyPlayer(authClient)
    lock()

    player.addListener('ready', async ({ device_id }) => {
      logger.log('ready with Device ID', device_id)
      deviceId = device_id

      const availableDevices = await apiClient.availableDevices()
      if (availableDevices?.length) {
        devices = availableDevices
      }
    })

    player.addListener('not_ready', ({ device_id }) => {
      logger.log('device ID has gone offline', device_id)
      deviceId = null
    })

    player.addListener('player_state_changed', playerStateChanged)

    player.addListener('playback_error', ({ message }) => {
      console.error('Playback error', message)
    })

    player.connect().then((success) => {
      if (!success) {
        throw new Error('Failed to connect')
      } else {
        logger.log('Connected to Spotify Web Playback SDK')
      }
    })
  })

  onDestroy(cleanup)
</script>

<Card
  class={[
    open ? 'block' : 'hidden',
    'absolute top-[calc(100%+10px)] right-0 w-xl'
  ]}
>
  {#if playbackState}
    <TrackFeedback
      {playbackState}
      {position}
      onSeek={() => apiClient.seekToPosition(position)}
      onShuffle={(shuffleState) => apiClient.toggleShuffle(shuffleState)}
      onPrev={() => player?.previousTrack()}
      onNext={() => player?.nextTrack()}
      onPlayPause={() => player?.togglePlay()}
    />
  {:else}
    <p>No active track, select one first</p>
  {/if}
  <Devices {devices} onActivate={activateDevice} />
</Card>
