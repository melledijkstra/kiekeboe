<script lang="ts">
  import QueryProvider from '@/components/QueryProvider.svelte'
  import { loadModule } from '@/modules'
  import { onMount } from 'svelte'
  import QueryTest from './QueryTest.svelte'
  import MetricsPanel from '@/modules/trackers/MetricsPanel.svelte'
  import MetricsBar from '@/components/topbar/MetricsBar.svelte'

  let hello = $state('Hi there')

  onMount(() => {
    console.log('DebugApp mounted')
  })
</script>

<QueryProvider>
  <main class="text-white p-5">
    <h1 class="text-2xl font-bold">{hello}</h1>
    <p>This is a debug page for testing</p>
    <details>
      <summary class="text-2xl font-bold">Habits Module</summary>
      {#await loadModule('habits') then Module}
        <Module.scene />
      {/await}
    </details>

    <details>
      <summary class="text-2xl font-bold">Query Test</summary>
      <QueryTest />
    </details>

    <details>
      <summary class="text-2xl font-bold">Metrics</summary>
      <MetricsBar />
      <MetricsPanel visible />
    </details>
  </main>
</QueryProvider>

<style>
  :global(body) {
    color: white;
  }
</style>
