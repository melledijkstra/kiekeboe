<script lang="ts">
  import { backgroundImage } from '@/stores/background.svelte'
  import { fade } from 'svelte/transition'

  let url = $derived($backgroundImage)
</script>

{#if url}
  {#key url}
    <div
      class="fixed inset-0 -z-20 bg-center bg-no-repeat bg-cover bg-fixed"
      style="background-image: url({url})"
      transition:fade={{ duration: 300 }}
    ></div>
  {/key}
{/if}
