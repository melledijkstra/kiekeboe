<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Devices from '@/components/musicplayer/Devices.svelte'
  import { devices } from '@/fixtures/spotify/devices'
  import { fn } from '@storybook/test'

  const { Story } = defineMeta({
    title: 'Components/Spotify/Devices',
    component: Devices,
    tags: ['autodocs'],
    argTypes: {},
    args: {
      devices,
      onActivate: fn()
    }
  })
</script>

<Story name="Default" />
