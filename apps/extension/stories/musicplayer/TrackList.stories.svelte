<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import TrackList from '@/components/musicplayer/TrackList.svelte'
  import { tracks } from '@/fixtures/musicplayer/tracks'
  import { fn } from '@storybook/test'

  const { Story } = defineMeta({
    title: 'Music Player/Track List',
    component: TrackList,
    args: {
      tracks,
      onTrackSelected: fn()
    }
  })
</script>

<Story name="Default" />

<Story
  name="Empty"
  args={{
    tracks: []
  }}
/>
