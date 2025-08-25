<script lang="ts">
  import { isRaspberryAlive } from '@/api/raspberry'
  import { settingsStore } from '@/settings/index.svelte'
  import Status from './atoms/Status.svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import { derived } from 'svelte/store'

  const statusQuery = createQuery(
    derived(settingsStore, (settings) => ({
      queryKey: ['raspberrypi', settings.network.databaseUri],
      enabled: !!settings.network.databaseUri,
      queryFn: () => isRaspberryAlive(settings.network.databaseUri)
    })
  ))
</script>

<Status pinging={$statusQuery.isFetching} status={$statusQuery.data ?? null} />
