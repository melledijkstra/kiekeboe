<script lang="ts">
  import { isRaspberryAlive } from '@/api/raspberry'
  import { settingsStore } from '@/settings'
  import { onMount } from 'svelte'

  let raspberryStatus: boolean | null = $state(null)

  async function fetchDatabaseStatus() {
    try {
      raspberryStatus = await isRaspberryAlive($settingsStore.network.databaseUri)
    } catch (error) {
      raspberryStatus = false
    }
  }

  onMount(() => {
    const unsub = settingsStore.subscribe(() => {
      if ($settingsStore.loaded) {
        fetchDatabaseStatus()
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
