<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Logger } from '@/logger'
  import { initializeSpotifyPlayer } from './player'
  import Icon from '@/components/Icon.svelte'
  import {
    mdiPause,
    mdiPlay,
    mdiRepeat,
    mdiRepeatOff,
    mdiRepeatOnce,
    mdiShuffleVariant,
    mdiSkipNext,
    mdiSkipPrevious
  } from '@mdi/js'
  import { millisecondsToTime } from '@/time/utils'
  import Card from '@/components/Card.svelte'
  import { SpotifyClient } from '@/api/spotify'
  import type { Device } from '@/api/definitions/spotify'

  const PLAYER_LOCK_FLAG = 'spotifyInitialized'

  let EMPTY: undefined

  const logger = new Logger('spotify')

  const { open, token } = $props()
  let apiClient = $state(new SpotifyClient(token))
  let deviceId = $state<string | null>(null)
  let player = $state<Spotify.Player | null>(null)
  let isActive = $state(false)
  let isShuffling = $state(false)
  let repeatMode = $state(0)
  let repeatModeIcon = $derived(
    repeatMode === 0
      ? mdiRepeatOff
      : repeatMode === 1
        ? mdiRepeatOnce
        : mdiRepeat
  )
  let isPaused = $state(true)
  let currentTrack = $state<Spotify.Track | undefined>(undefined)
  let songDuration = $state(0) // in ms
  let position = $state(0) // in ms
  let remaining = $derived(songDuration - position)
  let completedPercent = $derived(Math.ceil((position / songDuration) * 100))
  let timeLeft = $derived<string>(millisecondsToTime(remaining))
  let currentTime = $derived<string>(millisecondsToTime(position))
  let hasLock = $state(false)
  let devices = $state<Device[]>([])

  let playbackLoop = $state<number>()

  async function playerStateChanged(state: Spotify.PlaybackState) {
    logger.log('state change', state)
    if (!state) {
      if (isActive) {
        isActive = false
      }
      return
    }

    isPaused = state.paused
    isShuffling = state.shuffle
    repeatMode = state.repeat_mode
    currentTrack = state.track_window.current_track
    songDuration = state.track_window.current_track.duration_ms
    position = state.position

    if (!state.paused) {
      if (!playbackLoop) {
        playbackLoop = setInterval(() => {
          logger.log('updating time')
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

    player = await initializeSpotifyPlayer(token)
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
  {#if currentTrack}
    <div class="flex flex-row gap-4">
      <img
        class="size-20 rounded-sm"
        src={currentTrack.album.images[0].url}
        alt={currentTrack.name}
      />
      <div class="flex flex-col justify-center overflow-hidden">
        <strong class="truncate text-xl">{currentTrack.name}</strong>
        <p class="truncate">
          {currentTrack.artists.map((artist) => artist.name).join(', ')}
        </p>
      </div>
    </div>
    <div class="mt-2 flex w-full flex-row justify-between text-sm">
      <div>{currentTime}</div>
      <div>-{timeLeft}</div>
    </div>
    <input
      type="range"
      min="0"
      max={songDuration}
      bind:value={position}
      onchange={() => apiClient.seekToPosition(position)}
      tabindex="0"
      class="mb-4 w-full bg-gray-200/50 rounded-full h-2 dark:bg-gray-700"
    />
    <div class="flex flex-row justify-between">
      <button onclick={() => apiClient.toggleShuffle(!isShuffling)}>
        <Icon
          class="size-6 {isShuffling ? 'text-green-500' : 'text-white'}"
          path={mdiShuffleVariant}
        />
      </button>
      <button onclick={() => player?.previousTrack()}>
        <Icon class="size-6 fill-white" path={mdiSkipPrevious} />
      </button>
      <button onclick={() => player?.togglePlay()}>
        <Icon class="size-6 fill-white" path={isPaused ? mdiPlay : mdiPause} />
      </button>
      <button onclick={() => player?.nextTrack()}>
        <Icon class="size-6 fill-white" path={mdiSkipNext} />
      </button>
      <button disabled>
        <Icon class="size-6 fill-white" path={repeatModeIcon} />
      </button>
    </div>
  {:else}
    <p>No active track, select one first</p>
  {/if}
  {#if !isActive}
    <p class="mt-2">
      This is currently not the active device, transfer playback to this device
    </p>
    <div class="flex flex-row gap-2 mt-2">
      {#each devices as device (device.id)}
        <button
          class="p-2 {device.id === deviceId
            ? 'bg-green-700'
            : 'bg-zinc-900'} hover:bg-zinc-600 rounded-sm"
          onclick={() => activateDevice(device.id)}
        >
          {device.name}
        </button>
      {/each}
    </div>
  {/if}
</Card>
