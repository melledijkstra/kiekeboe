<script lang="ts">
  import { toasts } from "@/stores/toasts.svelte";
  import { fade } from "svelte/transition"

  const { position }: { position: string } = $props()
</script>

<div
  class={[
    position.includes('top') && "top-0",
    position.includes('bottom') && "bottom-0",
    position.includes('right') && "right-0",
    position.includes('left') && "left-0",
    "fixed p-4 z-50 text-lg"
  ]}
>
  {#each $toasts as { id, message, type } (id)}
    <div
      transition:fade
      class={[
        "mb-2 p-3 rounded shadow-md text-white",
        type === 'success' ? 'bg-green-500/70' :
        type === 'error' ? 'bg-red-500/70' : 'bg-blue-500/70'
      ]}
    >
      {message}
    </div>
  {/each}
</div>