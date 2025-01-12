<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { log } from "@/logger"
  import { initializeSpotifyPlayer, transferPlaybackDevice } from "./player"
  import Icon from "@/components/Icon.svelte"
  import { mdiPause, mdiPlay, mdiReload, mdiShuffleVariant, mdiSkipNext, mdiSkipPrevious } from "@mdi/js"
  import { millisecondsToTime } from "./utils"
  import Card from "@/components/Card.svelte"

  let EMPTY: undefined;

  const { token } = $props()
  let deviceId = $state<string | null>(null)
  let player = $state<Spotify.Player | null>(null)
  let isActive = $state(false)
  let isPaused = $state(true)
  let currentTrack = $state<Spotify.Track | undefined>(undefined)
  let songDuration = $state(0) // in ms
  let position = $state(0) // in ms
  let remaining = $derived(songDuration - position)
  let completedPercent = $derived(Math.ceil((position / songDuration) * 100))
  let timeLeft = $derived<string>(millisecondsToTime(remaining))
  let currentTime = $derived<string>(millisecondsToTime(position))
  
  let playbackLoop = $state<number>()

  async function playerStateChanged(state: Spotify.PlaybackState) {
    log('state change', state)
    if (!state) {
      if (isActive) {
        isActive = false
      }
      return
    }

    isPaused = state.paused
    currentTrack = state.track_window.current_track
    songDuration = state.track_window.current_track.duration_ms
    position = state.position

    if (!state.paused) {
      if (!playbackLoop) {
        playbackLoop = setInterval(() => {
          log('updating time')
          position += 1000
        }, 1000)
      }
    } else {
      clearInterval(playbackLoop)
      playbackLoop = EMPTY
    }

    isActive = !!(await player?.getCurrentState())
  }

  async function forceActivateDevice() {
    if (deviceId) {
      const result = await transferPlaybackDevice(deviceId, token)
      isActive = result
    }
  }

  onMount(async () => {
    player = await initializeSpotifyPlayer(token)

    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id)
      deviceId = device_id
    })

    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id)
      deviceId = null
    })

    player.addListener('player_state_changed', playerStateChanged)

    player.addListener('playback_error', ({ message }) => {
      console.error('Playback error', message)
    })

    player.connect().then((success) => {
      if (!success) {
        throw new Error('Failed to connect')
      }
    })
  })

  onDestroy(() => {
    if (player) {
      player.disconnect()
    }
    if (playbackLoop) {
      clearInterval(playbackLoop)
      playbackLoop = EMPTY
    }
  })
</script>

<Card>
  {#if currentTrack}
  <div class="flex flex-row gap-4">
    <img class="size-20 rounded" src={currentTrack.album.images[0].url} alt={currentTrack.name} />
    <div class="flex flex-col justify-center overflow-hidden">
      <strong class="truncate text-xl">{currentTrack.name}</strong>
      <p class="truncate">{currentTrack.artists.map(artist => artist.name).join(', ')}</p>
    </div>
  </div>
  <div class="mt-2 flex w-full flex-row justify-between text-sm">
    <div>{currentTime}</div>
    <div>-{timeLeft}</div>
  </div>
  <hr style="width: {completedPercent}%;" class="mb-4 h-1 rounded-full bg-white outline-none" />
  <div class="flex flex-row justify-between">
    <button disabled>
      <Icon class="size-6 fill-white" path={mdiShuffleVariant} />
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
      <Icon class="size-6 fill-white" path={mdiReload} />
    </button>
  </div>
  {:else}
    <p>No active track, select one first</p>
  {/if}
  {#if !isActive}
    <p class="mt-2">This is currently not the active device, transfer playback to this device</p>
    <button onclick={forceActivateDevice} class="my-2 p-2 bg-zinc-900 hover:bg-zinc-600 rounded">Force activate this device</button>
  {/if}
</Card>
