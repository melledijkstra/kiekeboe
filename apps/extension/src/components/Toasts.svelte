<script lang="ts">
  import { toasts } from "@/stores/toasts.svelte"
  import { fade } from "svelte/transition"

  const { position }: { position: string } = $props()
</script>

<div
  class={[
    position.includes('top') && "top-0",
    position.includes('bottom') && "bottom-0",
    position.includes('right') && "right-0",
    position.includes('left') && "left-0",
    'flex flex-col fixed p-4 z-50 text-sm',
  ]}
>
  {#each $toasts as { id, message, type } (id)}
    <div
      transition:fade
      class={[
        "mb-2 p-2 px-3 rounded-lg shadow-md text-white",
        type === 'success' ? 'bg-green-500/70' :
        type === 'error' ? 'bg-red-500/70' : 'bg-blue-500/70'
      ]}
    >
      {message}
    </div>
  {/each}
</div>