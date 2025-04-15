<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import SpotifyPlayback from '@/components/musicplayer/TrackFeedback.svelte'
  import { playbackState } from '@/fixtures/spotify/playback'
  import { fn } from '@storybook/test'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Atoms/Spotify/Control',
    component: SpotifyPlayback,
    args: {
      playbackState,
      position: Math.round(
        playbackState.track_window.current_track.duration_ms / 3
      ),
      onSeek: fn(),
      onShuffle: fn(),
      onPrev: fn(),
      onNext: fn(),
      onPlayPause: fn(),
      onRepeat: fn()
    }
  })
</script>

<Story name="Default" />

<Story
  name="Paused"
  args={{ playbackState: { ...playbackState, paused: true } }}
/>

<Story
  name="Shuffling"
  args={{ playbackState: { ...playbackState, shuffle: true } }}
/>

<Story
  name="Repeating"
  args={{ playbackState: { ...playbackState, repeat_mode: 1 } }}
/>
