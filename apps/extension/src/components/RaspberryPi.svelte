<script lang="ts">
  import { isRaspberryAlive } from '@/api/raspberry'
  import { log } from '@/logger'
  import { settingsStore } from '@/settings/index.svelte'
  import { onMount } from 'svelte'

  let raspberryStatus: boolean | null = $state(null)
  let lastCheckedUri: string | null = $state(null)

  async function fetchDatabaseStatus(URI?: string) {
    try {
      raspberryStatus = await isRaspberryAlive(URI ?? $settingsStore.network.databaseUri)
    } catch {
      raspberryStatus = false
    }
  }

  onMount(() => {
    log('RaspberryPi mounted')
  })

  $effect(() => {
    if (!$settingsStore.loaded) {
      return
    }

    if (
      $settingsStore.network.databaseUri && 
      $settingsStore.network.databaseUri !== lastCheckedUri
    ) {
      fetchDatabaseStatus($settingsStore.network.databaseUri)
      lastCheckedUri = $settingsStore.network.databaseUri
    }
  })
</script>

<div class={[
  'transition-colors rounded-full',
  'size-5 shadow-center',
  raspberryStatus === null ? 'bg-gray-300 shadow-gray-400' : 
  raspberryStatus ? 'bg-green-500 shadow-green-400' : 'bg-red-500 shadow-red-400'
]}></div>
