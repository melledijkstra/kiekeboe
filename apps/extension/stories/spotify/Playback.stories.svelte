<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import SpotifyPlayback from '@/components/musicplayer/Playback.svelte'
  import { playbackState } from '@/fixtures/musicplayer/state'
  import { fn } from '@storybook/test'

  const { Story } = defineMeta({
    title: 'Music Player/Playback',
    component: SpotifyPlayback,
    args: {
      playbackState,
      onToggleShuffle: fn(),
      onPreviousTrack: fn(),
      onPlayPause: fn(),
      onNextTrack: fn(),
      onSwitchRepeatMode: fn(),
      onSeek: fn()
    }
  })
</script>

<Story name="Default" />

<Story
  name="Paused"
  args={{ playbackState: { ...playbackState, isPlaying: false } }}
/>

<Story
  name="Shuffling"
  args={{ playbackState: { ...playbackState, shuffle: true } }}
/>
