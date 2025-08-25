<script lang="ts">
  import QueryProvider from '@/components/QueryProvider.svelte'
  import { loadModule } from '@/modules'
  import { onMount } from 'svelte'
  import QueryTest from './QueryTest.svelte'

  let hello = $state('Hi there')

  onMount(() => {
    console.log('DebugApp mounted')
  })
</script>

<QueryProvider>
  <main class="text-white p-5">
    <h1 class="text-2xl font-bold">{hello}</h1>
    <p>This is a debug page for testing</p>
    {#await loadModule('habits') then Module}
      <Module.scene />
    {/await}

    <QueryTest />
  </main>
</QueryProvider>

<style>
  :global(body) {
    color: white;
  }
</style>
