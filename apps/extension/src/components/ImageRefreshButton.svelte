<script lang="ts">
  import { UnsplashClient } from '@/api/unsplash'
  import { updateBackgroundImage } from '@/ui'
  import IconButton from './atoms/IconButton.svelte'
  import { mdiCameraRetakeOutline } from '@mdi/js'
  import { settingsStore } from '@/settings/index.svelte'
  import { onMount } from 'svelte'
  import { log } from '@/logger'

  let unsplashClient = $state<UnsplashClient>()

  async function refreshBackround() {
    const url = await unsplashClient?.refreshDailyImage()
    if (url) {
      updateBackgroundImage(url)
    }
  }

  $effect(() => {
    log('ImageRefreshButton effect triggered', {
      loaded: $settingsStore.loaded,
      serverlessHost: $settingsStore.network.serverlessHost,
      unsplashHost: unsplashClient?.host
    })
    if (
      $settingsStore.loaded && 
      $settingsStore.network.serverlessHost &&
      $settingsStore.network.serverlessHost !== unsplashClient?.host
    ) {
      unsplashClient?.setHost($settingsStore.network.serverlessHost)
    }
  })

  $effect(() => {
    if (!unsplashClient) {
      return
    }

    if ($settingsStore.ui.dailyImageQuery !== unsplashClient.query) {
      log(
        'query changed',
        $settingsStore.ui.dailyImageQuery
      )
      unsplashClient.query = $settingsStore.ui.dailyImageQuery
      // if query changes we need to clean cached images
      unsplashClient.clearNextImage()
    }
  })

  onMount(async () => {
    log('ImageRefreshButton mounted')
    unsplashClient = new UnsplashClient(
      $settingsStore.network.serverlessHost,
      $settingsStore.ui.dailyImageQuery
    )
  })
</script>

<IconButton disabled={!$settingsStore.loaded} onclick={refreshBackround} icon={mdiCameraRetakeOutline} />
