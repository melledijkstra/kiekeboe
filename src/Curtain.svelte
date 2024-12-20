<script>
  const { loaded } = $props();
</script>

<div class="absolute h-full w-full bg-black transition-opacity top-0 left-0 -z-10 {loaded ? 'opacity-10' : 'opacity-100'}"></div>