<script lang="ts">
  import { UnsplashClient } from '@/api/unsplash'
  import { setBackgroundImage } from '@/stores/background.svelte'
  import IconButton from './atoms/IconButton.svelte'
  import { mdiCameraRetakeOutline } from '@mdi/js'
  import { settingsStore } from '@/settings/index.svelte'
  import { log } from '@/logger'
  import { onMount } from 'svelte'

  let unsplashClient = $state<UnsplashClient>(
    new UnsplashClient(
      $settingsStore.network.serverlessHost,
      $settingsStore.ui.dailyImageQuery
    )
  )

  let serverlessHost = $derived($settingsStore.network.serverlessHost)
  let dailyImageQuery = $derived($settingsStore.ui.dailyImageQuery)

  async function refreshBackround() {
    const url = await unsplashClient?.refreshDailyImage()
    if (url) {
      setBackgroundImage(url)
    }
  }

  $effect(() => {
    if (!!serverlessHost && serverlessHost !== unsplashClient?.host) {
      unsplashClient.setHost(serverlessHost)
    }
  })

  onMount(() => {
    settingsStore.subscribe((settings) => {
      log('settings changed', {
        serverlessHost: settings.network.serverlessHost,
        unsplashHost: unsplashClient?.host,
        dailyImageQuery: settings.ui.dailyImageQuery,
        unsplashQuery: unsplashClient.query
      })
      if (!!serverlessHost && serverlessHost !== unsplashClient?.host) {
        log('serverlessHost changed', {
          serverlessHost,
          unsplashHost: unsplashClient?.host
        })
        unsplashClient.setHost(settings.network.serverlessHost)
      }
      if (dailyImageQuery !== unsplashClient.query) {
        log('query changed', {
          dailyImageQuery,
          unsplashQuery: unsplashClient.query
        })
        unsplashClient.query = settings.ui.dailyImageQuery
        unsplashClient.clearNextImage()
      }
    })
  })
</script>

<IconButton
  size={25}
  disabled={!$settingsStore.loaded}
  onclick={refreshBackround}
  icon={mdiCameraRetakeOutline}
/>
