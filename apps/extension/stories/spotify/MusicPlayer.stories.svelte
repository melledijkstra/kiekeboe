<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import MusicPlayer from '@/components/musicplayer/MusicPlayer.svelte'
  import { mockController } from './MockMusicPlayerController'

  const { Story } = defineMeta({
    title: 'Music Player/MusicPlayer',
    component: MusicPlayer,
    args: {
      controller: mockController
    }
  })
</script>

<Story name="Default">
  {#snippet template()}
    <div class={[
      'flex flex-col',
      'rounded-xl shadow-md backdrop-blur-xs',
      // dark theme
      'dark:bg-black/60 dark:text-white',
      // light theme
      'bg-white/40 text-black',
      'max-h-[600px] max-w-[900px] z-40 overflow-hidden',
    ]}>
      <MusicPlayer controller={mockController} />
    </div>
  {/snippet}
</Story>
