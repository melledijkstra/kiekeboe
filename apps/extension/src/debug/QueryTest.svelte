<script lang="ts">
  import Button from '@/components/atoms/Button.svelte'
  import { createQuery } from '@tanstack/svelte-query'

  const query = createQuery({
    queryKey: ['test'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return 'Hello, world!'
    }
  })
</script>

<div>
  <Button onclick={() => $query.refetch()}>Refetch</Button>
  {#if $query.isFetching}
    <p class="text-sm text-gray-500">Loading...</p>
  {:else if $query.isError}
    <p class="text-sm text-red-500">Error: {$query.error.message}</p>
  {:else}
    <p class="text-sm text-green-500">{$query.data}</p>
  {/if}
</div>