<script lang="ts">
  import { UnsplashClient } from '@/api/unsplash'
  import { setBackgroundImage } from '@/stores/background.svelte'
  import IconButton from './atoms/IconButton.svelte'
  import { mdiCameraRetakeOutline } from '@mdi/js'
  import { settingsStore } from '@/settings/index.svelte'
  import { log } from '@/logger'

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
    log('ImageRefreshButton effect triggered', {
      serverlessHost,
      unsplashHost: unsplashClient?.host
    })

    if (!!serverlessHost && serverlessHost !== unsplashClient?.host) {
      unsplashClient.setHost(serverlessHost)
    }
  })

  $effect(() => {
    log('query changed', {
      dailyImageQuery,
      unsplashQuery: unsplashClient.query
    })

    if (dailyImageQuery !== unsplashClient.query) {
      unsplashClient.query = dailyImageQuery
      // if query changes we need to clean cached images
      unsplashClient.clearNextImage()
    }
  })
</script>

<IconButton
  disabled={!$settingsStore.loaded}
  onclick={refreshBackround}
  icon={mdiCameraRetakeOutline}
/>
