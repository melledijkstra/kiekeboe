<script lang="ts">
  import { isRaspberryAlive } from '@/api/raspberry'
  import { settingsStore } from '@/settings'
  import { onMount } from 'svelte'

  let raspberryStatus: boolean | null = $state(null)

  async function fetchDatabaseStatus(URI?: string) {
    try {
      raspberryStatus = await isRaspberryAlive(URI ?? $settingsStore.network.databaseUri)
    } catch (error) {
      raspberryStatus = false
    }
  }

  onMount(() => {
    const unsub = settingsStore.subscribe((settings) => {
      if (settings.loaded) {
        fetchDatabaseStatus(settings.network.databaseUri)
        unsub()
      }
    })
  })
</script>

<div class={[
  'transition-colors rounded-full',
  'size-5 shadow-center',
  raspberryStatus === null ? 'bg-gray-300 shadow-gray-400' : 
  raspberryStatus ? 'bg-green-500 shadow-green-400' : 'bg-red-500 shadow-red-400'
]}></div>
