<script lang="ts">
  import type { Device } from 'SpotifyApi'
  import Icon from '@/components/atoms/Icon.svelte'
  import { mdiVolumeHigh } from '@mdi/js'

  type DevicesProps = {
    devices: Device[]
    onActivate: (deviceId: string) => void
    playerDeviceId?: string
  }

  let open = $state(false)

  const { playerDeviceId, devices, onActivate }: DevicesProps = $props()
  const activeDevice = $derived(devices.find((device) => device.is_active))
  const otherDevices = $derived(devices.filter((device) => !device.is_active))
  const isActiveDevice = $derived(playerDeviceId === activeDevice?.id)
</script>

<div
  class={[
    "relative flex justify-end gap-1 py-1 px-2 w-full text-white rounded-b-xl",
    "transition-colors duration-1000",
    isActiveDevice ? 'bg-green-700' : 'transparent',
  ]}
>
  {#if activeDevice}
    <Icon class="inline" path={mdiVolumeHigh} size={15} />
  {/if}
  <button
    onclick={() => (open = !open)}
    class={['text-xs hover:underline cursor-pointer']}
  >
    {activeDevice?.name ?? 'Select Device'}
  </button>
  <div
    class="{open
      ? 'block'
      : 'hidden'} absolute bottom-full p-1 bg-black rounded text-white shadow-md"
  >
    {#each otherDevices as device (device.id)}
      <button
        class="flex text-xs w-full justify-between items-center hover:bg-green-800 cursor-pointer"
        onclick={() => onActivate(device.id)}
      >
        <p>{device.name}</p>
      </button>
    {/each}
  </div>
</div>
