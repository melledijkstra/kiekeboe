<script lang="ts">
  import { onMount } from 'svelte'
  import { UnsplashClient } from '@/api/unsplash'
  import { setBackgroundImage } from '@/ui'

  let client = $state<UnsplashClient>(new UnsplashClient())
  let loaded = $state(false)

  onMount(async () => {
    if (document.body.id !== 'curtain-image') {
      document.body.id = 'curtain-image'
    }

    const url = await client?.getDailyImage()

    if (url) {
      await setBackgroundImage(url)
      loaded = true
    }
  })
</script>

<style lang="postcss">
  :root {
    --background-image: url();
  }

  :global {
    #curtain-image {
      @apply h-screen w-screen overflow-x-hidden;

      background-color: #000;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      background-attachment: fixed;
      background-image: var(--background-image);
    }
  }
</style>

<div
  class="fixed h-screen w-screen bg-black transition-opacity duration-300 top-0 left-0 -z-10 {loaded
    ? 'opacity-20'
    : 'opacity-100'}"
></div>
