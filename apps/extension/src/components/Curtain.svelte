<script lang="ts">
  import { onMount } from 'svelte'
  import { UnsplashClient } from '@/api/unsplash'
  import { setBackgroundImage } from '@/stores/background.svelte'

  let client = $state<UnsplashClient>(new UnsplashClient())
  let loaded = $state(false)

  onMount(async () => {
    const url = await client?.getDailyImage()

    if (url) {
      await setBackgroundImage(url)
      loaded = true
    }
  })
</script>

<div
  class="fixed h-screen w-screen bg-black transition-opacity duration-300 top-0 left-0 -z-10 {loaded
    ? 'opacity-20'
    : 'opacity-100'}"
></div>
