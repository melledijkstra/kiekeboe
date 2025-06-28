<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import SpotifyPlayback from '@/components/musicplayer/Playback.svelte'
  import { playbackState } from '@/fixtures/spotify/playback'
  import { mockController } from './MockMusicPlayerController'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Spotify/Playback',
    component: SpotifyPlayback,
    args: {
      controller: mockController
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
