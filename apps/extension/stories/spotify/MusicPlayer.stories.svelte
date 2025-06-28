<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import MusicPlayer from '@/components/musicplayer/MusicPlayer.svelte'
  import { mockController } from './MockMusicPlayerController'

  const { Story } = defineMeta({
    title: 'Spotify/MusicPlayer',
    component: MusicPlayer,
    args: {
      controller: mockController
    }
  })
</script>

<Story name="Default" />
