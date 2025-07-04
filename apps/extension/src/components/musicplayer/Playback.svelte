<script lang="ts">
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
  import Icon from '../atoms/Icon.svelte'
  import { millisecondsToTime } from '@/time/utils'
  import { spotifyState } from '@/modules/spotify/spotify.store.svelte'
  import type { MusicPlayerInterface } from '@/controllers/MusicPlayerInterface'
  import { onMount } from 'svelte'

  const { controller }: { controller: MusicPlayerInterface } = $props()

  let isPaused = $derived(spotifyState.playbackState?.is_playing ?? true)
  let isShuffling = $derived(spotifyState.playbackState?.shuffle_state ?? false)
  let repeatMode = $derived(spotifyState.playbackState?.repeat_state ?? 0)
  let repeatModeIcon = $derived.by(() => {
    switch (repeatMode) {
      case 1:
        return mdiRepeatOnce
      case 2:
        return mdiRepeat
      case 0:
      default:
        return mdiRepeatOff
    }
  })
  let track = $derived(spotifyState.playbackState?.item)
  let position = $derived(spotifyState.playbackState?.progress_ms ?? 0)
  let remaining = $derived(track ? track.duration_ms - position : 0)
  let timeLeft = $derived<string>(millisecondsToTime(remaining))
  let currentTime = $derived<string>(millisecondsToTime(position))

  onMount(() => {
    controller.retrievePlaybackState()
  })
</script>

<div class="flex flex-row p-2">
  <!-- Track Info -->
  <div class="flex flex-row gap-4 mr-5">
    <img
      class="size-20 rounded-sm"
      src={track?.album.images[0].url ?? '/icons/album-cover-placeholder.png'}
      alt={track?.name ?? 'Track cover'}
    />
    <div class="flex flex-col justify-center overflow-hidden">
      <strong class="truncate text-xl">{track?.name}</strong>
      <p class="truncate">
        {track?.artists.map((artist) => artist.name).join(', ')}
      </p>
    </div>
  </div>
  <!-- Controls -->
  <div class="flex flex-col w-96 gap-3">
    <div class="flex flex-row justify-between">
      <button
        class="cursor-pointer"
        onclick={() => {
          controller.toggleShuffle?.(!isShuffling)
        }}
      >
        <Icon
          class="size-6 {isShuffling ? 'text-green-500' : 'text-white'}"
          path={mdiShuffleVariant}
        />
      </button>
      <button class="cursor-pointer" onclick={() => controller.previousTrack()}>
        <Icon class="size-6 fill-white" path={mdiSkipPrevious} />
      </button>
      <button class="cursor-pointer" onclick={() => controller.togglePlayPause?.()}>
        <Icon class="size-6 fill-white" path={isPaused ? mdiPlay : mdiPause} />
      </button>
      <button class="cursor-pointer" onclick={() => controller.nextTrack()}>
        <Icon class="size-6 fill-white" path={mdiSkipNext} />
      </button>
      <button class="cursor-pointer"
        disabled={typeof repeatMode === 'undefined'}
        onclick={() => repeatMode && controller.switchRepeatMode(repeatMode)}>
        <Icon class="size-6 fill-white" path={repeatModeIcon} />
      </button>
    </div>
    <div class="mt-2 flex flex-row gap-2 items-center justify-between text-sm">
      <div>{currentTime}</div>
      <input
        type="range"
        min="0"
        max={track?.duration_ms}
        bind:value={position}
        onchange={() => controller.seek?.(position)}
        tabindex="0"
        class="bg-gray-200/50 rounded-full h-2 accent-green-700"
      />
      <div>-{timeLeft}</div>
    </div>
  </div>
</div>
