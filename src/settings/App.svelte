<script lang="ts">
  import { onMount } from 'svelte'
  import { MODULE_CONFIG } from '@/modules'
  import { type Settings, DEFAULT_SETTINGS, getSettings, saveSettings } from './index'
  import '@/app.css'

  let settings = $state<Settings>(DEFAULT_SETTINGS)
  let settingsLoaded = $state(false)

  async function loadSettings() {
    settings = await getSettings()
    settingsLoaded = true
  }

  onMount(() => {
    loadSettings()
  })
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
          bind:checked={settings.modules[id]}
          onchange={() => saveSettings(settings)} />
      </p>
      <p class="text-gray-400">{id}: {settings.modules[id]} (default: {DEFAULT_SETTINGS.modules?.[id]})</p>
    {/each}
  </div>
</div>



