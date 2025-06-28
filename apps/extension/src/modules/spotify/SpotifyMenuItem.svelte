<script lang="ts">
  import { mdiSpotify } from '@mdi/js'
  import { Popover } from 'bits-ui'
  import Icon from '@/components/atoms/Icon.svelte'
  import SpotifyPlayback from './SpotifyPanel.svelte'
</script>

<Popover.Root>
  <Popover.Trigger
    class={[
      'dark:text-white/70 dark:hover:text-white text-zinc-500 hover:text-zinc-700',
      'block cursor-pointer transition-colors'
    ]}
  >
    <Icon path={mdiSpotify} size={40} />
  </Popover.Trigger>
  <SpotifyPlayback />
</Popover.Root>
