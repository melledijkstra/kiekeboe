<script lang="ts">
  import { fade } from 'svelte/transition'
  import Clock from './Clock.svelte'
  import Curtain from './Curtain.svelte'
  import Account from './Account.svelte'
  import Welcome from './Welcome.svelte'
  import { onMount, type Component } from 'svelte'
  import { getSettings } from './settings'
  import { log } from './logger'
  import { appState } from './app-state.svelte'
  import Button from './components/Button.svelte'
  import Icon from './components/Icon.svelte'
  import { mdiCameraRetakeOutline } from '@mdi/js'
  import { loadImage, refreshDailyImage } from './unsplash'

  const appModes = ['default', 'breathing', 'pomodoro', 'focus'] as const

  type AppMode = typeof appModes[number]
  
  let ModTasks: Component | null = $state(null);
  let ModCommandCenter: Component | null = $state(null);
  let ModWellBeing: Component | null = $state(null);
  let ModSpotify: Component | null = $state(null);
  let ModWorldClocks: Component | null = $state(null);

  let currentMode = $state<AppMode>('default')

  function switchMode(mode: AppMode) {
    currentMode = mode
  }

  onMount(async () => {
    const appSettings = await getSettings()
    appState.settings = appSettings

    log({ appSettings })

    if (appSettings.modules.google_tasks) {
      const file = 'Tasks' as const
      const module = await import(`./modules/google-tasks/${file}.svelte`)
      log('module loaded', file)
      ModTasks = module.default
    }

    if (appSettings.modules.command_center) {
      const file = 'CommandCenter' as const
      const module = await import(`./modules/command-center/${file}.svelte`)
      log('module loaded', file)
      ModCommandCenter = module.default
    }

    if (appSettings.modules.well_being) {
      const file = 'WellBeing' as const
      const module = await import(`./modules/well-being/${file}.svelte`)
      log('module loaded', file)
      ModWellBeing = module.default
    }

    if (appSettings.modules.spotify) {
      const file = 'Spotify' as const
      const module = await import(`./modules/spotify/${file}.svelte`)
      log('module loaded', file)
      ModSpotify = module.default
    }

    if (appSettings.modules.world_clocks) {
      const file = 'WorldClocks' as const
      const module = await import(`./modules/world-clocks/${file}.svelte`)
      log('module loaded', file)
      ModWorldClocks = module.default
    }
  })

  async function refreshBackround() {
    const url = await refreshDailyImage()
    if (url) {
      loadImage(url)
    }
  }
</script>

<Curtain />

{#if ModCommandCenter}
  <ModCommandCenter />
{/if}

<div class="grid h-full grid-rows-3 grid-rows animate-fade-in">
  <!-- TOP --->
  <div class="flex flex-row gap-10 p-5 justify-self-end items-start">
    {#each appModes as mode}
      <Button
        onclick={() => switchMode(mode)}
        className={currentMode === mode ? 'font-bold' : ''}
      >
        {mode}
      </Button>
    {/each}
    {#if ModWorldClocks}
      <ModWorldClocks />
    {/if}
    {#if ModSpotify}
      <ModSpotify />
    {/if}
    {#if ModWellBeing}
      <ModWellBeing onclick={() => {switchMode('breathing');return true;}} />
    {/if}
    <Account />
  </div>
  <!-- MIDDLE --->
  {#key currentMode}
    <div
      transition:fade={{ duration: 200 }}
      class="justify-self-center self-center text-center"
      style="grid-row: 2; grid-column: 1">
      {#if currentMode === 'default'}
        <Clock />
        <Welcome />
      {:else}
        <p class="text-white text-lg">Not yet implemented!</p>
      {/if}
    </div>
  {/key}
  <!-- BOTTOM -->
  <div class="flex flex-row justify-between content-end items-end">
    <!-- BOTTOM LEFT -->
    <div class="flex flex-row p-5">
      <button onclick={refreshBackround}>
        <Icon
          class="text-slate-400 hover:text-white cursor-pointer"
          size={48}
          path={mdiCameraRetakeOutline} />
      </button>
    </div>
    <!-- BOTTOM RIGHT -->
    <div>
      {#if ModTasks}
        <ModTasks />
      {/if}
    </div>
  </div>
</div>

