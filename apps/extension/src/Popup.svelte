<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import MusicPlayer from '@/components/musicplayer/MusicPlayer.svelte'
  import { SpotifyController } from '@/controllers/SpotifyController'
  import Pomodoro from '@/modules/focus/Pomodoro.svelte'

  let spotify = $state<SpotifyController>(new SpotifyController())

  function cleanup() {
    spotify.destroy()
  }

  onMount(() => {
    spotify.initialize()
  })

  onDestroy(cleanup)
</script>

<div class="w-96 p-2 space-y-4 bg-zinc-900 text-white">
  {#if SpotifyController.hasLockAcquired()}
    <MusicPlayer controller={spotify} />
  {:else}
    <p class="text-center">Spotify player active in another tab</p>
  {/if}
  <Pomodoro onMinutePassed={() => {}} />
</div>
