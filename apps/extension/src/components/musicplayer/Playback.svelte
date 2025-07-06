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
  import type { State } from 'MusicPlayer'
  
  type PlaybackProps = {
    playbackState?: State
    onToggleShuffle?: (shuffle: boolean) => void
    onPreviousTrack?: () => void
    onPlayPause?: () => void
    onNextTrack?: () => void
    onSwitchRepeatMode?: (mode: number) => void
    onSeek?: (position_ms: number) => void
  }

  const {
    playbackState: state,
    onToggleShuffle,
    onPreviousTrack,
    onPlayPause,
    onNextTrack,
    // onSwitchRepeatMode,
    onSeek
  }: PlaybackProps = $props()

  let isShuffling = $derived(state?.shuffle ?? false)
  let repeatMode = $derived(0)
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
  let mediaItem = $derived(state?.currentItem)
  let position_ms = $derived(state?.position_ms ?? 0)
  let remaining = $derived(mediaItem ? mediaItem.duration_ms - position_ms : 0)
  let timeLeft = $derived<string>(millisecondsToTime(remaining))
  let currentTime = $derived<string>(millisecondsToTime(position_ms))
</script>

<div class="flex flex-row p-2">
  <!-- Track Info -->
  <div class="flex flex-row gap-4 mr-5">
    <img
      class="size-20 rounded-sm"
      src={mediaItem?.album?.coverArtUrl ?? '/icons/album-cover-placeholder.png'}
      alt={mediaItem?.title ?? 'Track cover'}
    />
    <div class="flex flex-col justify-center overflow-hidden">
      <strong class="truncate text-xl">{mediaItem?.title ?? 'No item playing'}</strong>
      <p class="truncate">
        {mediaItem?.artist.name ?? '-'}
      </p>
    </div>
  </div>
  <!-- Controls -->
  <div class="flex flex-col w-96 gap-3">
    <div class="flex flex-row justify-between">
      <button
        class="cursor-pointer"
        onclick={() => {
          onToggleShuffle?.(!isShuffling)
        }}
      >
        <Icon
          class="size-6 {isShuffling ? 'text-green-500' : 'text-white'}"
          path={mdiShuffleVariant}
        />
      </button>
      <button class="cursor-pointer" onclick={() => onPreviousTrack?.()}>
        <Icon class="size-6 fill-white" path={mdiSkipPrevious} />
      </button>
      <button class="cursor-pointer" onclick={() => onPlayPause?.()}>
        <Icon class="size-6 fill-white" path={state?.isPlaying ? mdiPause : mdiPlay} />
      </button>
      <button class="cursor-pointer" onclick={() => onNextTrack?.()}>
        <Icon class="size-6 fill-white" path={mdiSkipNext} />
      </button>
      <button class="cursor-pointer" disabled={true}>
        <Icon class="size-6 fill-white peer-disabled:fill-amber-600" path={repeatModeIcon} />
      </button>
    </div>
    <div class="mt-2 flex flex-row gap-2 items-center justify-between text-sm">
      <div>{currentTime}</div>
      <input
        type="range"
        min="0"
        max={mediaItem?.duration_ms}
        value={position_ms}
        onchange={(e) => onSeek?.(e.currentTarget.valueAsNumber)}
        tabindex="0"
        class="bg-gray-200/50 rounded-full h-2 accent-green-700"
      />
      <div>-{timeLeft}</div>
    </div>
  </div>
</div>
