<script lang="ts">
  import { MODULE_CONFIG } from "@/modules"
  import { settingsStore, saveSettingsToStorage, DEFAULT_SETTINGS } from "@/settings"

  const { settingsLoaded }: { settingsLoaded: boolean } = $props()
</script>

<h1 class="text-xl">Modules Settings</h1>
<p class="mb-4 text-gray-400">Enable or disable modules</p>
{#each MODULE_CONFIG as { id, title } (id)}
  <p class="font-bold">
    <input
      disabled={!settingsLoaded}
      class="scale-150 mr-2"
      type="checkbox"
      onchange={() => saveSettingsToStorage($settingsStore)}
      bind:checked={$settingsStore.modules[id]}
    />
    <span class="text-base">{title}</span>
  </p>
  <p class="text-gray-400">
    {id}: {$settingsStore.modules[id]} (default: {DEFAULT_SETTINGS
      .modules?.[id]})
  </p>
{/each}