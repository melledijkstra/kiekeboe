<script>
  import { onMount } from "svelte";
  import { getTime } from "./ui";
  
  let time = $state(getTime());

  function startClock() {
    setInterval(() => {
      time = getTime();
    }, 1000);
  }

  onMount(() => {
    startClock();
  });
</script>

<style>
  h1 {
    @apply text-white text-9xl;
  }
</style>

<h1 class="time">{time}</h1>
