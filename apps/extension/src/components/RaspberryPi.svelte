<script lang="ts">
  import { isRaspberryAlive } from '@/api/raspberry'
  import { settings } from '@/settings/index.svelte'
  import { onMount } from 'svelte'

  let raspberryStatus: boolean | null = $state(null)
  let lastCheckedUri: string | null = $state(null)

  async function fetchDatabaseStatus(URI?: string) {
    try {
      raspberryStatus = await isRaspberryAlive(URI ?? settings.state.network.databaseUri)
    } catch {
      raspberryStatus = false
    }
  }

  onMount(() => {
    console.log('RaspberryPi mounted')
  })

  $effect(() => {
    if (!settings.state.loaded) {
      return
    }

    if (
      settings.state.network.databaseUri && 
      settings.state.network.databaseUri !== lastCheckedUri
    ) {
      fetchDatabaseStatus(settings.state.network.databaseUri)
      lastCheckedUri = settings.state.network.databaseUri
    }
  })
</script>

<div class={[
  'transition-colors rounded-full',
  'size-5 shadow-center',
  raspberryStatus === null ? 'bg-gray-300 shadow-gray-400' : 
  raspberryStatus ? 'bg-green-500 shadow-green-400' : 'bg-red-500 shadow-red-400'
]}></div>
