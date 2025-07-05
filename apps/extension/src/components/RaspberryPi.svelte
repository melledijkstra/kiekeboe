<script lang="ts">
  import { isRaspberryAlive } from '@/api/raspberry'
  import { log } from '@/logger'
  import { settingsStore } from '@/settings/index.svelte'

  let raspberryStatus: boolean | null = $state(null)

  let settingsLoaded = $derived($settingsStore.loaded)
  let databaseUri = $derived($settingsStore.network.databaseUri)

  async function fetchDatabaseStatus(URI?: string) {
    try {
      raspberryStatus = await isRaspberryAlive(URI ?? $settingsStore.network.databaseUri)
    } catch {
      raspberryStatus = false
    }
  }

  $effect(() => {
    if (!settingsLoaded) {
      return
    }

    log('Raspberry Pi database URI changed, checking status...', databaseUri)
    if (databaseUri) {
      fetchDatabaseStatus(databaseUri)
    }
  })
</script>

<div class={[
  'transition-colors rounded-full',
  'size-5 shadow-center',
  raspberryStatus === null ? 'bg-gray-300 shadow-gray-400' : 
  raspberryStatus ? 'bg-green-500 shadow-green-400' : 'bg-red-500 shadow-red-400'
]}></div>
