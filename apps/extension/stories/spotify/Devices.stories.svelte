<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Devices from '@/components/musicplayer/Devices.svelte'
  import { devices } from '@/fixtures/spotify/devices'
  import { fn } from '@storybook/test'

  const { Story } = defineMeta({
    title: 'Spotify/Devices',
    component: Devices,
    args: {
      playerDeviceId: devices[0]?.id,
      devices,
      onActivate: fn(),
    }
  })
</script>

<Story name="Default" />
