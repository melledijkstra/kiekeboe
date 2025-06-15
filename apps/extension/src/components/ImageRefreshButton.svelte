<script lang="ts">
  import { UnsplashClient } from '@/api/unsplash'
  import IconButton from './atoms/IconButton.svelte'
  import { mdiCameraRetakeOutline } from '@mdi/js'
  import { settingsStore } from '@/settings'

  let unsplashClient = $state(
    new UnsplashClient(
      $settingsStore.network.serverlessHost,
      $settingsStore.ui.dailyImageQuery
    )
  )

  async function refreshBackround() {
    const url = await unsplashClient.refreshDailyImage()
    if (url) {
      unsplashClient.loadImage(url)
    }
  }

  $effect(() => {
    if ($settingsStore.network.serverlessHost) {
      unsplashClient.setHost($settingsStore.network.serverlessHost)
    }
  })

  $effect(() => {
    if ($settingsStore.ui.dailyImageQuery !== unsplashClient.query) {
      console.log(
        'query changed',
        $settingsStore.ui.dailyImageQuery
      )
      unsplashClient.query = $settingsStore.ui.dailyImageQuery
      // if query changes we need to clean cached images
      unsplashClient.clearNextImage()
    }
  })
</script>

<IconButton onclick={refreshBackround} icon={mdiCameraRetakeOutline} />
