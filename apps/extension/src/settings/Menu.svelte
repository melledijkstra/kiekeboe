<script lang="ts">
  import {
    settingsStore,
    syncSettingsStoreWithStorage,
  } from '@/settings'
  import { onMount } from 'svelte'
  import NetworkTab from './tabs/NetworkTab.svelte'
  import AboutTab from './tabs/AboutTab.svelte'
  import ExportTab from './tabs/ExportTab.svelte'
  import AppearanceTab from './tabs/AppearanceTab.svelte'
  import AuthenticationTab from './tabs/AuthenticationTab.svelte'
  import ModulesTab from './tabs/ModulesTab.svelte'
  import GeneralTab from './tabs/GeneralTab.svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { Separator, Tabs } from 'bits-ui'

  const sections = [
    'general',
    'modules',
    'authentication',
    'appearance',
    'export',
    'network',
    'about'
  ]

  const props: HTMLAttributes<HTMLDivElement> = $props()

  let tab = $state(getSelectedTabFromUrl())
  let settingsLoaded = $state(false)

  function getSelectedTabFromUrl() {
    return document.location.hash.replace('#', '')
  }

  function selectTab(value: string) {
    tab = value
    document.location.hash = value.toString()
  }

  onMount(() => {
    syncSettingsStoreWithStorage().then(() => (settingsLoaded = true))
  })
</script>

<Tabs.Root
  orientation="vertical"
  class="flex h-full"
  bind:value={() => tab, selectTab}
>
  <Tabs.List class={[
    'p-5',
    'flex flex-col text-zinc-600 dark:text-white',
    props.class
  ]}>
    {#each sections as sectionName}
      <Tabs.Trigger
        value={sectionName}
        class={[
          sectionName === tab ? 'underline' : '',
          'dark:hover:text-slate-300 hover:text-zinc-800',
          'text-left text-lg font-bold capitalize'
        ]}>
        {sectionName}
      </Tabs.Trigger>
    {/each}
  </Tabs.List>
  <Separator.Root
    class="w-px h-full dark:bg-zinc-200 bg-zinc-700 mx-2"
    orientation="vertical"
  />
  {#each sections as sectionName}
    <Tabs.Content value={sectionName} class="flex-1 p-5 overflow-y-auto">
      {#if sectionName === 'general' && !settingsLoaded}
        <div>Loading...</div>
      {/if}
      {#if sectionName === 'general'}
        <GeneralTab settingsLoaded={settingsLoaded} />
      {:else if sectionName === 'modules' && $settingsStore}
        <ModulesTab settingsLoaded={settingsLoaded} />
      {:else if sectionName === 'authentication'}
        <AuthenticationTab />
      {:else if sectionName === 'appearance'}
        <AppearanceTab />
      {:else if sectionName === 'export'}
        <ExportTab />
      {:else if sectionName === 'network'}
        <NetworkTab />
      {:else if sectionName === 'about'}
        <AboutTab />
      {/if}
    </Tabs.Content>
  {/each}
</Tabs.Root>
