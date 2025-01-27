<script lang="ts">
  import browser, { type Manifest } from 'webextension-polyfill'
  import { onMount } from "svelte"
  import { MODULE_CONFIG } from "@/modules"
  import { DEFAULT_SETTINGS, getSettings, type Settings } from "@/settings"
  import FloatMenu from "@/components/FloatMenu.svelte"

  let { open } = $props()
  let tab = $state(0)
  let settings = $state<Settings>()
  let manifest = $state<Manifest.WebExtensionManifest>()

  onMount(async () => {
    settings = await getSettings()
    manifest = browser.runtime.getManifest()
  })
</script>

<style>
  .scrollbar-white {
    scrollbar-color: #ddd #ddd;
    scrollbar-width: thin;
  }
</style>

<FloatMenu open={open} nopadding class="flex flex-row overflow-hidden w-[500px] h-96">
  <nav class="border-r-[1px] p-5 border-slate-500">
    <button class={[tab === 0 && 'text-white', "block text-lg font-bold"]} onclick={() => tab = 0}>General</button>
    <button class={[tab === 1 && 'text-white', "block text-lg font-bold"]} onclick={() => tab = 1}>Modules</button>
    <button class={[tab === 2 && 'text-white', "block text-lg font-bold"]} onclick={() => tab = 2}>Appearance</button>
    <button class={[tab === 3 && 'text-white', "block text-lg font-bold"]} onclick={() => tab = 3}>About</button>
  </nav>
  <div class="p-5 w-full overflow-y-auto text-white scrollbar-white">
    {#if tab === 0}
      <h1 class="text-xl">General Settings</h1>
    {/if}
    {#if tab === 1 && settings}
      <h1 class="text-xl">Modules Settings</h1>
      <p class="mb-4 text-gray-400">Enable or disable modules</p>
      {#each MODULE_CONFIG as { id, title } (id)}
        <p class="font-bold">
          <input
            disabled
            class="scale-150 mr-2" type="checkbox"
            bind:checked={settings.modules[id]}
            />
          <span class="text-base">{title}</span>
        </p>
        <p class="text-gray-400">{id}: {settings.modules[id]} (default: {DEFAULT_SETTINGS.modules?.[id]})</p>
      {/each}
    {/if}
    {#if tab === 2}
      <h1 class="text-xl">Appearance Settings</h1>
    {/if}
    {#if tab === 3}
      <h1 class="text-xl">About</h1>
      <hr class="mb-4" />
      <p class="text-sm"><strong>Extension Name:</strong> {manifest?.name}</p>
      <p class="text-sm"><strong>Description:</strong> {manifest?.description}</p>
      <p class="text-sm"><strong>Version:</strong> {manifest?.version}</p>
    {/if}
  </div>
</FloatMenu>
