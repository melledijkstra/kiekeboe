<script lang="ts">
  import { onMount } from 'svelte'
  import { UnsplashClient } from '@/api/unsplash'
  import { updateBackgroundImage } from '@/ui'

  let client = $state<UnsplashClient>()
  let loaded = $state(false)

  onMount(() => {
    client = new UnsplashClient()

    if (document.body.id !== 'curtain-image') {
      document.body.id = 'curtain-image'
    }
    
    setBackgroundImage()
  })

  async function setBackgroundImage() {
    const url = await client?.getDailyImage()

    if (url) {
      updateBackgroundImage(url, () => {
        loaded = true
      })
    }
  }
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
