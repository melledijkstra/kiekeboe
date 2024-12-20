<script lang="ts">
  import { getDailyImage } from './unsplash';
  import { getTime, getWelcomeMessage } from './ui';
  import { fetchPhotos } from './photos';
  import { fetchTasks } from './tasks';
  import { onMount } from 'svelte';

  let imageUrl = $state('');
  let loaded = $state(false);
  let welcomeMsg = $state('');

  onMount(() => {
    setBackgroundImage();
  }); 

  async function setBackgroundImage () {
    const url = await getDailyImage();
    if (url) {
      const image = new Image();
      image.onload = () => {
        imageUrl = url;
        document.body.style.setProperty('--background-image', `url(${url})`);
        loaded = true;
        image.remove();
      };
      image.src = url;
    }
  }

  $effect(() => {
    getWelcomeMessage().then((msg) => {
      welcomeMsg = msg;
    })
  });
</script>

<style>
  .curtain {
    position: absolute;
    background-color: #000;
    top: 0;
    left: 0;
    z-index: -1;
    height: 100%;
    width: 100%;

    transition: opacity 0.2s ease-in-out;
    opacity: 1;
  }

  .curtain.loaded {
    opacity: 0.1;
  }
</style>

<div class="curtain {loaded ? 'loaded' : ''}"></div>
<h1 class="time">{getTime()}</h1>
<h2 class="welcome">{welcomeMsg}</h2>
<button class="photos" onclick={fetchPhotos}>Google Photos</button>
<button class="tasks" onclick={fetchTasks}>Tasks</button>

