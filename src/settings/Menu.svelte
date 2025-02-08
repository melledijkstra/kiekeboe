<script lang="ts">
  import browser, { type Manifest } from 'webextension-polyfill'
  import { MODULE_CONFIG } from '@/modules'
  import {
    DEFAULT_SETTINGS,
    saveSettingsToStorage,
    settingsStore,
    syncSettingsStoreWithStorage
  } from '@/settings'
  import { onMount } from 'svelte'
  import Toggle from '@/components/Toggle.svelte'
  import TextInput from '@/components/TextInput.svelte'
  import { AuthClient } from '@/oauth2/auth'
  import TextButton from '@/components/TextButton.svelte'
  import AuthButton from '@/components/AuthButton.svelte'

  const clients = {
    google: new AuthClient('google'),
    spotify: new AuthClient('spotify'),
    fitbit: new AuthClient('fitbit')
  }

  let manifest = $state<Manifest.WebExtensionManifest>()
  let tab = $state(getSelectedTabFromUrl())
  let settingsLoaded = $state(false)
  let authState = $state({
    google: false,
    spotify: false,
    fitbit: false
  })

  function getSelectedTabFromUrl() {
    const parsed = parseInt(document.location.hash.replace('#', ''))
    return isNaN(parsed) ? 0 : parsed
  }

  function selectTab(index: number) {
    tab = index
    document.location.hash = index.toString()
  }

  async function retrieveAuthState() {
    authState.google = await clients.google.isAuthenticated()
    authState.spotify = await clients.spotify.isAuthenticated()
    authState.fitbit = await clients.fitbit.isAuthenticated()
  }

  onMount(() => {
    syncSettingsStoreWithStorage().then(() => (settingsLoaded = true))
    manifest = browser.runtime.getManifest()
  })
</script>

<style>
  .custom-scrollbar {
    scrollbar-color: #ddd #000;
    scrollbar-width: thin;
  }
</style>

<div class="flex flex-row items-stretch text-white w-full">
  <nav class="border-r-[1px] p-5 border-slate-500">
    <TextButton
      class={[
        tab === 0 && 'underline',
        'block text-lg font-bold cursor-pointer'
      ]}
      onclick={() => selectTab(0)}
    >
      General
    </TextButton>
    <TextButton
      disabled={!settingsLoaded}
      class={[
        tab === 1 && 'underline',
        'block text-lg font-bold cursor-pointer'
      ]}
      onclick={() => selectTab(1)}>Modules</TextButton
    >
    <TextButton
      class={[
        tab === 2 && 'underline',
        'block text-lg font-bold cursor-pointer'
      ]}
      onclick={() => selectTab(2)}>Authentication</TextButton
    >
    <TextButton
      class={[
        tab === 3 && 'underline',
        'block text-lg font-bold cursor-pointer'
      ]}
      onclick={() => selectTab(3)}>Appearance</TextButton
    >
    <TextButton
      class={[
        tab === 4 && 'underline',
        'block text-lg font-bold cursor-pointer'
      ]}
      onclick={() => selectTab(4)}>About</TextButton
    >
  </nav>
  <div class="flex-1 p-5 overflow-y-auto custom-scrollbar">
    {#if tab === 0}
      <h1 class="text-xl">General Settings</h1>
      <Toggle
        disabled={!settingsLoaded}
        label="Show currently focussed task (required Google Tasks)"
        parentClass="my-2"
        onchange={() => saveSettingsToStorage($settingsStore)}
        bind:checked={$settingsStore.ui.showCurrentTask}
      />
    {:else if tab === 1 && $settingsStore}
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
    {:else if tab === 2}
      {#await retrieveAuthState() then _ignore}
        <h1 class="text-xl mb-3">Authentication</h1>
        <div class="flex flex-col gap-3">
          <p class="text-sm">
            <strong>Google:</strong>
            <span class="text-gray-400">{authState.google}</span>
            {#if !authState.google}
              <AuthButton
                class="mt-2"
                provider={'google'}
                onAuth={(token) => (authState.google = !!token)}
              />
            {/if}
          </p>
          <p class="text-sm">
            <strong>Spotify:</strong>
            <span class="text-gray-400">{authState.spotify}</span>
            {#if !authState.spotify}
              <AuthButton
                class="mt-2"
                provider={'spotify'}
                onAuth={(token) => (authState.spotify = !!token)}
              />
            {/if}
          </p>
          <p class="text-sm">
            <strong>Fitbit:</strong>
            <span class="text-gray-400">{authState.fitbit}</span>
            {#if !authState.fitbit}
              <AuthButton
                class="mt-2"
                provider={'fitbit'}
                onAuth={(token) => (authState.fitbit = !!token)}
              />
            {/if}
          </p>
        </div>
      {/await}
    {:else if tab === 3}
      <h1 class="mb-2 text-xl">Appearance Settings</h1>
      <label for="unsplash-collection">Unsplash Collection</label>
      <TextInput
        disabled
        name="unsplash-collection"
        placeholder="Unsplash collection"
      />
    {:else if tab === 4}
      <h1 class="text-xl">About</h1>
      <p class="text-sm"><strong>Extension Name:</strong> {manifest?.name}</p>
      <p class="text-sm">
        <strong>Description:</strong>
        {manifest?.description}
      </p>
      <p class="text-sm"><strong>Version:</strong> {manifest?.version}</p>
    {/if}
  </div>
</div>
