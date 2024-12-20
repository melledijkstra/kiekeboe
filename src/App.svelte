<script lang="ts">
  import { getDailyImage } from './unsplash';
  import { getWelcomeMessage } from './ui';
  import { onMount } from 'svelte';
  import Clock from './Clock.svelte';
  import Curtain from './Curtain.svelte';
  import Tasks from './Tasks.svelte';
  import Account from './Account.svelte';

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

<Curtain {loaded} />

<div class="grid h-full grid-rows-3 grid-rows">
  <!-- TOP --->
  <div class="justify-self-end">
    <Account />
  </div>
  <!-- MIDDLE --->
  <div class="justify-self-center self-center text-center">
    <Clock />
    <h2>{welcomeMsg}</h2>
  </div>
  <!-- BOTTOM -->
  <div class="justify-self-end self-end"> 
    <Tasks />
  </div>
</div>

