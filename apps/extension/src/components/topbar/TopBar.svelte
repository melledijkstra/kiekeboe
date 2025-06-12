<script lang="ts">
  import { loadModule, type ModuleID } from '@/modules'
  import { mdiHomeOutline, mdiSpa, mdiSprout } from '@mdi/js'
  import { appState, switchAppMode } from '@/app-state.svelte'
  import IconButton from '@/components/atoms/IconButton.svelte'
  import { settingsStore } from '@/settings'
  import MetricsPanel from '@/modules/trackers/MetricsPanel.svelte'
  import Account from './Account.svelte'
  import Metrics from './MetricsBar.svelte'
  import RaspberryPi from '../RaspberryPi.svelte'
  import MetricsPanelTrigger from '@/modules/trackers/MetricsPanelTrigger.svelte'

  let metricsPanelOpen = $state(false)

  const openMetricsPanel = () => {
    metricsPanelOpen = true
  }

  const closeMetricsPanel = () => {
    metricsPanelOpen = false
  }

  const toggleMetricsPanel = () => {
    metricsPanelOpen = !metricsPanelOpen
  }
</script>

{#snippet module(moduleId: ModuleID)}
  {#if $settingsStore.modules?.[moduleId]}
    {#await loadModule(moduleId) then Module}
      <Module.component />
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
    <MetricsPanelTrigger
      onOpen={openMetricsPanel}
      onClose={closeMetricsPanel}
      isOpen={metricsPanelOpen}
    >
      <MetricsPanel open={metricsPanelOpen} />
    </MetricsPanelTrigger>
    <Metrics />
    {@render module('spotify')}
    {@render module('weather')}
    <Account />
  </div>
</header>
