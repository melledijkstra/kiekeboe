<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import MusicPlayer from '@/components/musicplayer/MusicPlayer.svelte'
  import { MockMusicPlayerController } from '@/mocks/MockMusicPlayerController'
  import { playbackState } from '@/fixtures/musicplayer/state'
  import { devices } from '@/fixtures/spotify/devices'
  import type { State } from 'MusicPlayer'

  const state: State = $state(playbackState)

  const controller = new MockMusicPlayerController(state)

  const { Story } = defineMeta({
    title: 'Music Player/MusicPlayer',
    component: MusicPlayer,
    args: {
      state,
      controller,
      devices: devices,
      deviceId: devices[0].id
    }
  })
</script>

<Story name="Interactive">
  {#snippet template(args)}
    <div class="bg-black/80 w-[600px] h-[500px] rounded-md">
      <MusicPlayer {...args} />
    </div>
  {/snippet}
</Story>
