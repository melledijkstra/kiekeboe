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

<h1 class="time">{time}</h1>
