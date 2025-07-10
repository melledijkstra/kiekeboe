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
  import type { HTMLAttributes } from 'svelte/elements'
  import { Slider } from 'bits-ui'
  
  type PlaybackProps = {
    playbackState?: State
    onToggleShuffle?: (shuffle: boolean) => void
    onPreviousTrack?: () => void
    onPlayPause?: () => void
    onNextTrack?: () => void
    onSwitchRepeatMode?: (mode: number) => void
    onSeek?: (position_ms: number) => void
    class?: HTMLAttributes<HTMLDivElement>['class']
  }

  const {
    playbackState: state,
    onToggleShuffle,
    onPreviousTrack,
    onPlayPause,
    onNextTrack,
    // onSwitchRepeatMode,
    onSeek,
    ...props
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
  let duration = $derived(mediaItem?.duration_ms ? millisecondsToTime(mediaItem.duration_ms) : 0)
  let currentTime = $derived<string>(millisecondsToTime(position_ms))
</script>


<div class={["text-white", props.class]}>
  <!-- Seeker -->
  <Slider.Root
    type="single"
    value={position_ms}
    onValueCommit={(value) => onSeek?.(value)}
    max={mediaItem?.duration_ms ?? 0}
    class="bg-transparent relative flex w-full touch-none select-none items-center cursor-pointer group/seeker"
  >
    <span
      class="bg-white/50 relative h-1 w-full grow overflow-hidden"
    >
      <Slider.Range class="bg-white absolute h-full" />
    </span>
    <Slider.Thumb
      index={0}
      class={[
        "block size-2.5 bg-background shadow-sm cursor-pointer rounded-full",
        "dark:bg-white dark:shadow-black/30",
        "border border-white/70 hover:border-white",
        "scale-0 group-hover/seeker:scale-100 data-active:scale-120 transition-transform",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-hidden",
      ]}
    />
  </Slider.Root>
  <div class="flex flex-row items-center py-1 px-3">
    <!-- Track Info -->
    <div class="flex flex-row gap-4 mr-5">
      <img
        draggable="false"
        class="size-15 rounded-sm"
        src={mediaItem?.album?.coverArtUrl ?? '/icons/album-cover-placeholder.png'}
        alt={mediaItem?.title ?? 'Track cover'}
      />
      <div class="flex flex-col justify-center overflow-hidden">
        <strong class="truncate text-base">{mediaItem?.title ?? 'No item playing'}</strong>
        <p class="truncate text-sm">
          {mediaItem?.artist.name ?? '-'}
        </p>
      </div>
    </div>
    <!-- Controls -->
    <div class="flex flex-col gap-3">
      <div class="flex flex-row">
        <button
          class="cursor-pointer"
          onclick={() => {
            onToggleShuffle?.(!isShuffling)
          }}
        >
          <Icon
            class="size-6 {isShuffling && 'text-green-500'}"
            path={mdiShuffleVariant}
          />
        </button>
        <button class="cursor-pointer" onclick={() => onPreviousTrack?.()}>
          <Icon class="size-6" path={mdiSkipPrevious} />
        </button>
        <button class="cursor-pointer p-1 rounded-full bg-white text-black" onclick={() => onPlayPause?.()}>
          <Icon class="size-6" path={state?.isPlaying ? mdiPause : mdiPlay} />
        </button>
        <button class="cursor-pointer" onclick={() => onNextTrack?.()}>
          <Icon class="size-6" path={mdiSkipNext} />
        </button>
        <button
          class="cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={true}
        >
          <Icon class="size-6" path={repeatModeIcon} />
        </button>
      </div>
      <div class="mt-2 flex flex-row gap-2 items-center justify-between text-sm">
        <span>{currentTime} / {duration}</span>
      </div>
    </div>
  </div>
</div>
