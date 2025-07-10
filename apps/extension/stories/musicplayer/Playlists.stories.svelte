<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Playlists from '@/components/musicplayer/Playlists.svelte'
  import { playlists } from '@/fixtures/musicplayer/playlists'
  import { fn } from '@storybook/test'

  const { Story } = defineMeta({
    title: 'Music Player/Playlists',
    component: Playlists,
    args: {
      playlists: playlists,
      onPlaylistPlay: fn(),
      onPlaylistSelected: fn()
    }
  })
</script>

<Story name="Default" />

<Story
  name="Empty"
  args={{
    playlists: []
  }}
/>
