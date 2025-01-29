<script lang="ts">
  import { onMount } from 'svelte'
  import { MODULE_CONFIG } from '@/modules'
  import { settingsStore, DEFAULT_SETTINGS, saveSettingsToStorage, syncSettingsStoreWithStorage } from './index'
  import '@/app.css'

  let settingsLoaded = $state(false)

  async function loadSettings() {
    await syncSettingsStoreWithStorage()
    settingsLoaded = true
  }

  onMount(loadSettings)
</script>

<div class="bg-black min-h-screen text-white">
  <div class="container mx-auto p-5">
    <h1 class="text-4xl my-4 font-bold">Settings</h1>
    <hr />
    <h2 class="text-xl mt-2 font-bold">Modules</h2>
    <p class="mb-4 text-gray-400">Enable or disable modules</p>
    {#each MODULE_CONFIG as { id, title } (id)}
      <p class="font-bold">
        <span class="mr-2 text-base">{title}</span>
        <input
          disabled={!settingsLoaded}
          class="scale-150" type="checkbox"
          bind:checked={$settingsStore.modules[id]}
          onchange={() => saveSettingsToStorage($settingsStore)} />
      </p>
      <p class="text-gray-400">{id}: {$settingsStore.modules[id]} (default: {DEFAULT_SETTINGS.modules?.[id]})</p>
    {/each}
  </div>
</div>



