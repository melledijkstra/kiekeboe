<script lang="ts">
  import {
    settingsStore,
    syncSettingsStoreWithStorage,
  } from '@/settings'
  import { onMount } from 'svelte'
  import TextButton from '@/components/TextButton.svelte'
  import NetworkTab from './tabs/NetworkTab.svelte'
  import AboutTab from './tabs/AboutTab.svelte'
  import ExportTab from './tabs/ExportTab.svelte'
  import AppearanceTab from './tabs/AppearanceTab.svelte'
  import AuthenticationTab from './tabs/AuthenticationTab.svelte'
  import ModulesTab from './tabs/ModulesTab.svelte'
  import GeneralTab from './tabs/GeneralTab.svelte'

  let tab = $state(getSelectedTabFromUrl())
  let settingsLoaded = $state(false)

  function getSelectedTabFromUrl() {
    const parsed = parseInt(document.location.hash.replace('#', ''))
    return isNaN(parsed) ? 0 : parsed
  }

  function selectTab(index: number) {
    tab = index
    document.location.hash = index.toString()
  }

  onMount(() => {
    syncSettingsStoreWithStorage().then(() => (settingsLoaded = true))
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
      onclick={() => selectTab(4)}>Export</TextButton
    >
    <TextButton
      class={[
        tab === 5 && 'underline',
        'block text-lg font-bold cursor-pointer'
      ]}
      onclick={() => selectTab(5)}>Network</TextButton
    >
    <TextButton
      class={[
        tab === 6 && 'underline',
        'block text-lg font-bold cursor-pointer'
      ]}
      onclick={() => selectTab(6)}>About</TextButton
    >
  </nav>
  <div class="flex-1 p-5 overflow-y-auto custom-scrollbar">
    {#if tab === 0}
      <GeneralTab settingsLoaded={settingsLoaded} />
    {:else if tab === 1 && $settingsStore}
      <ModulesTab settingsLoaded={settingsLoaded} />
    {:else if tab === 2}
      <AuthenticationTab />
    {:else if tab === 3}
      <AppearanceTab />
    {:else if tab === 4}
      <ExportTab />
    {:else if tab === 5}
      <NetworkTab />
    {:else if tab === 6}
      <AboutTab />
    {/if}
  </div>
</div>
