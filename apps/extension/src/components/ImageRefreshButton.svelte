<script lang="ts">
  import { UnsplashClient } from '@/api/unsplash'
  import { updateBackgroundImage } from '@/ui'
  import IconButton from './atoms/IconButton.svelte'
  import { mdiCameraRetakeOutline } from '@mdi/js'
  import { settings } from '@/settings/index.svelte'
  import { onMount } from 'svelte'

  let unsplashClient = $state<UnsplashClient>()

  async function refreshBackround() {
    const url = await unsplashClient?.refreshDailyImage()
    if (url) {
      updateBackgroundImage(url)
    }
  }

  $effect(() => {
    console.log('ImageRefreshButton effect triggered', {
      loaded: settings.state.loaded,
      serverlessHost: settings.state.network.serverlessHost,
      unsplashHost: unsplashClient?.host
    })
    if (
      settings.state.loaded && 
      settings.state.network.serverlessHost &&
      settings.state.network.serverlessHost !== unsplashClient?.host
    ) {
      unsplashClient?.setHost(settings.state.network.serverlessHost)
    }
  })

  $effect(() => {
    if (!unsplashClient) {
      return
    }

    if (settings.state.ui.dailyImageQuery !== unsplashClient.query) {
      console.log(
        'query changed',
        settings.state.ui.dailyImageQuery
      )
      unsplashClient.query = settings.state.ui.dailyImageQuery
      // if query changes we need to clean cached images
      unsplashClient.clearNextImage()
    }
  })

  onMount(async () => {
    console.log('ImageRefreshButton mounted')
    unsplashClient = new UnsplashClient(
      settings.state.network.serverlessHost,
      settings.state.ui.dailyImageQuery
    )
  })
</script>

<IconButton disabled={!settings.state.loaded} onclick={refreshBackround} icon={mdiCameraRetakeOutline} />
