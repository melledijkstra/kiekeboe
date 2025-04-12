<script lang="ts">
  import { loadModule, type ModuleID } from '@/modules'
  import { mdiHomeOutline, mdiSpa, mdiSprout } from '@mdi/js'
  import { appState, switchAppMode } from '@/app-state.svelte'
  import IconButton from '@/components/IconButton.svelte'
  import { settingsStore } from '@/settings'
  import AddMetricsDialog from '@/modules/trackers/AddTrackerDialog.svelte'
  import Account from './Account.svelte'
  import Metrics from './Metrics.svelte'
  import RaspberryPi from '../RaspberryPi.svelte'
</script>

{#snippet module(moduleId: ModuleID)}
  {#if $settingsStore.modules?.[moduleId]}
    {#await loadModule(moduleId) then Module}
      <Module.component />
    {/await}
  {/if}
{/snippet}

<header class="w-full p-5">
  <div
    class="float-left flex flex-row items-center justify-start align-middle gap-5"
  >
    <RaspberryPi />
    <IconButton
      onclick={() => switchAppMode('default')}
      tooltip="Home"
      icon={mdiHomeOutline}
    />
    {#if $settingsStore.modules.focus}
      <IconButton
        tooltip="Focus"
        onclick={() => switchAppMode('focus')}
        icon={mdiSprout}
      />
    {/if}
    {#if $settingsStore.modules.well_being}
      <IconButton
        tooltip="Breathing"
        onclick={() => switchAppMode('breathing')}
        icon={mdiSpa}
      />
    {/if}
  </div>
  <div
    class={[
      appState.mode === 'focus' ? 'invisible' : 'visible',
      'group float-right flex flex-row items-center justify-end align-middle gap-5'
    ]}
  >
    <AddMetricsDialog />
    <Metrics />
    {@render module('spotify')}
    {@render module('weather')}
    <Account />
  </div>
</header>
