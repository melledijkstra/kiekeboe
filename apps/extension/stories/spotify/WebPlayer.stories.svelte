<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import MusicPlayer from '@/components/musicplayer/MusicPlayer.svelte'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Atoms/Spotify/WebPlayer',
    component: MusicPlayer,
  })
</script>

<Story name="Default" />
