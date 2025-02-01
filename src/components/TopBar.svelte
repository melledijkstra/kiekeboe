<script lang="ts">
  import { loadModule, type ModuleID } from '@/modules'
  import {
    mdiHomeOutline,
    mdiPlus,
    mdiPlusCircle,
    mdiRocketLaunch,
    mdiSpa
  } from '@mdi/js'
  import { switchAppMode } from '@/app-state.svelte'
  import Account from '@/Account.svelte'
  import IconButton from './IconButton.svelte'
  import { settingsStore } from '@/settings'
  import Card from './Card.svelte'
  import Icon from './Icon.svelte'
  import { fade } from 'svelte/transition'

  let addMetricDialogOpen = $state(false)

  type Metric = { title: string; counter: number }

  let metrics = $state<Array<Metric>>([])
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
    class="float-left flex flex-row items-start justify-start align-middle gap-5"
  >
    <IconButton
      onclick={() => switchAppMode('default')}
      icon={mdiHomeOutline}
    />
    {#if $settingsStore.modules.pomodoro}
      <IconButton
        onclick={() => switchAppMode('pomodoro')}
        icon={mdiRocketLaunch}
      />
    {/if}
    {#if $settingsStore.modules.well_being}
      <IconButton onclick={() => switchAppMode('breathing')} icon={mdiSpa} />
    {/if}
  </div>
  <div
    class="group float-right flex flex-row items-start justify-end align-middle gap-5"
  >
    <div class="relative">
      <IconButton
        icon={mdiPlus}
        class={[
          addMetricDialogOpen ? 'opacity-100' : 'opacity-0',
          'group-hover:opacity-100 transition-opacity duration-300 p-1 flex-col cursor-pointer'
        ]}
        onclick={() => (addMetricDialogOpen = !addMetricDialogOpen)}
      >
        <span>Add</span>
      </IconButton>
      <Card
        class={[
          addMetricDialogOpen ? 'block' : 'hidden',
          'absolute right-0 text-center p-5 w-80'
        ]}
      >
        <p class="text-lg mb-4 font-bold">Add metric</p>
        <div class="flex flex-row justify-between gap-4 items-stretch">
          <button
            onclick={() =>
              (metrics = [...metrics, { title: 'Ramadan', counter: 32 }])}
          >
            <Icon path={mdiPlusCircle} />
            Countdown
          </button>
          <button
            onclick={() =>
              (metrics = [...metrics, { title: 'Dubai', counter: 12 }])}
          >
            <Icon path={mdiPlusCircle} />
            World Clock
          </button>
          <button
            onclick={() =>
              (metrics = [...metrics, { title: 'Sleep', counter: 8 }])}
          >
            <Icon path={mdiPlusCircle} />
            Sleep Tracker
          </button>
        </div>
      </Card>
    </div>
    {#each metrics as metric, i}
      <button
        transition:fade
        class="text-white bg-black/30 py-1 px-2 rounded-lg backdrop-blur-sm"
        onclick={() => (metrics = metrics.filter((_, j) => i !== j))}
      >
        <p class="text-lg">{metric.counter}</p>
        <p>{metric.title}</p>
      </button>
    {/each}
    {@render module('countdown')}
    {@render module('world_clocks')}
    {@render module('fitbit')}
    {@render module('spotify')}
    {@render module('weather')}
    <Account />
  </div>
</header>
