<script lang="ts">
  import { loadModule, type ModuleID } from '@/modules'
  import { mdiHomeOutline } from '@mdi/js'
  import { appState, switchAppMode } from '@/app-state.svelte'
  import { settingsStore } from '@/settings/index.svelte'
  import MetricsPanel from '@/modules/trackers/MetricsPanel.svelte'
  import Account from './Account.svelte'
  import Metrics from './MetricsBar.svelte'
  import RaspberryPi from '../RaspberryPi.svelte'
  import MenuButton from '../atoms/MenuButton.svelte'
</script>

{#snippet module(moduleId: ModuleID)}
  {#if $settingsStore.modules?.[moduleId]}
    {#await loadModule(moduleId) then Module}
      <Module.trigger />
    {/await}
  {/if}
{/snippet}

<header class={[
  "w-full p-5",
  // add vignette effect from top to bottom
  "bg-gradient-to-b from-zinc-600/60 to-80% to-transparent",
]}>
  <div
    class="float-left flex flex-row items-center justify-start align-middle gap-5"
  >
    <RaspberryPi />
    <MenuButton
      onclick={() => switchAppMode('default')}
      tooltip="Home"
      mdiIcon={mdiHomeOutline}
    />
    {@render module('focus')}
    {@render module('well_being')}
    {@render module('time_tools')}
  </div>
  <div
    class={[
      appState.mode === 'focus' ? 'invisible' : 'visible',
      'group float-right flex flex-row items-center justify-end align-middle gap-5'
    ]}
  >
    <MetricsPanel />
    <Metrics />
    {@render module('spotify')}
    {@render module('weather')}
    <Account />
  </div>
</header>
