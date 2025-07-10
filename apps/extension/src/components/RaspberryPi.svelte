<script lang="ts">
  import { isRaspberryAlive } from '@/api/raspberry'
  import { log } from '@/logger'
  import { settingsStore } from '@/settings/index.svelte'
  import Status from './atoms/Status.svelte'

  let raspberryStatus: boolean | null = $state(null)
  let isFetching = $state(false)

  let settingsLoaded = $derived($settingsStore.loaded)
  let databaseUri = $derived($settingsStore.network.databaseUri)

  async function fetchDatabaseStatus(URI?: string) {
    try {
      isFetching = true
      raspberryStatus = await isRaspberryAlive(URI ?? $settingsStore.network.databaseUri)
    } catch {
      raspberryStatus = false
    } finally {
      isFetching = false
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

<Status pinging={isFetching} status={raspberryStatus} />
