<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import SpotifyPanel from '@/modules/spotify/SpotifyPanel.svelte'
  
  const { Story } = defineMeta({
    title: 'Spotify/SpotifyPanel',
    component: SpotifyPanel,
  })
</script>

<Story name="Default" />
