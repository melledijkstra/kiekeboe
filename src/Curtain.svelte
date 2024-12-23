<script>
  import { onMount } from "svelte"
  import { getDailyImage } from "./unsplash"

  let loaded = $state(false);

  onMount(() => {
    setBackgroundImage();
  });

  async function setBackgroundImage () {
    const url = await getDailyImage();

    if (url) {
      const image = new Image();
      image.onload = () => {
        
        document.body.style.setProperty('--background-image', `url(${url})`);
        loaded = true;
        image.remove();
      };
      image.src = url;
    }
  }
</script>

<div class="absolute h-full w-full bg-black transition-opacity duration-300 top-0 left-0 -z-10 {loaded ? 'opacity-10' : 'opacity-100'}"></div>