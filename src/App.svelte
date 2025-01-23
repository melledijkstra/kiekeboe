<script lang="ts">
  import { fade } from 'svelte/transition'
  import Clock from './Clock.svelte'
  import Curtain from './Curtain.svelte'
  import Account from './Account.svelte'
  import Welcome from './Welcome.svelte'
  import { onMount, type Component } from 'svelte'
  import { getSettings } from './settings'
  import { Logger, log } from './logger'
  import { appStore } from '@/stores/app-store.svelte.ts'
  import Icon from './components/Icon.svelte'
  import { mdiCameraRetakeOutline, mdiHomeClock, mdiRocketLaunch } from '@mdi/js'
  import { loadImage, refreshDailyImage } from '@/api/unsplash'
  import Fitbit from './modules/fitbit/Fitbit.svelte'
  import Card from './components/Card.svelte'
  import { loadModule } from './modules/index.ts'

  const STORAGE_KEY = 'appMode'

  const appModes = ['default', 'breathing', 'pomodoro'] as const

  type AppMode = typeof appModes[number]
  
  let ModTasks: Component | null = $state(null)
  let ModCommandCenter: Component | null = $state(null)
  let ModWellBeing: Component | null = $state(null)
  let ModBreathing: Component | null = $state(null)
  let ModSpotify: Component | null = $state(null)
  let ModWorldClocks: Component | null = $state(null)
  let ModPomodoro: Component | null = $state(null)
  let ModCountdown: Component | null = $state(null)
  let ModWeather: Component | null = $state(null)

  let currentMode = $state<AppMode>(localStorage.getItem(STORAGE_KEY) as AppMode ?? 'default')

  function switchMode(mode: AppMode) {
    currentMode = mode
    localStorage.setItem(STORAGE_KEY, mode)
  }

  onMount(async () => {
    const appSettings = await getSettings()
    appStore.settings = appSettings

    log({ appSettings })

    if (appSettings.modules.google_tasks) {
      const module = await loadModule('google_tasks')
      ModTasks = module.component
    }

    if (appSettings.modules.command_center) {
      const module = await loadModule('command_center')
      ModCommandCenter = module.component
    }

    if (appSettings.modules.well_being) {
      const module = await loadModule('well_being')
      ModWellBeing = module.component
      if (module.scene) {
        ModBreathing = module.scene
      }
    }

    if (appSettings.modules.spotify) {
      const module = await loadModule('spotify')
      ModSpotify = module.component
    }

    if (appSettings.modules.world_clocks) {
      const module = await loadModule('world_clocks')
      ModWorldClocks = module.component
    }

    if (appSettings.modules.pomodoro) {
      const module = await loadModule('pomodoro')
      ModPomodoro = module.component
    }

    if (appSettings.modules.countdown) {
      const module = await loadModule('countdown')
      ModCountdown = module.component
    }

    if (appSettings.modules.weather) {
      const module = await loadModule('weather')
      ModWeather = module.component
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

<div class="grid h-screen animate-fade-in">
  <!-- TOP --->
  <div class="flex flex-row gap-10 p-5 justify-self-end items-start">
    <button
      class="text-white cursor-pointer"
      onclick={() => switchMode('default')}>
      <Icon path={mdiHomeClock} size={48} />
    </button>
    {#if ModCountdown}
    <ModCountdown />
    {/if}
    {#if ModWorldClocks}
    <ModWorldClocks />
    {/if}
    <Fitbit />
    {#if ModSpotify}
    <ModSpotify />
    {/if}
    {#if ModPomodoro}
      <button 
        class="text-white cursor-pointer"
        onclick={() => switchMode('pomodoro')}>
        <Icon path={mdiRocketLaunch} size={48} />
      </button>
    {/if}
    {#if ModWellBeing}
      <ModWellBeing onclick={() => switchMode('breathing')} />
    {/if}
    {#if ModWeather}
    <ModWeather />
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
      {:else if currentMode === 'breathing'}
        <ModBreathing />
      {:else if currentMode === 'pomodoro'}
        <ModPomodoro />
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
  </div>
</div>

<!-- <div class="container m-auto">
  <div class="grid grid-cols-4 gap-3">
    {#if ModTasks}
      <ModTasks />
    {/if}
    <Card>
      <iframe title="calendar" src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Europe%2FMadrid&showPrint=0&src=bWVsbGUuZHlrc3RyYUBnbWFpbC5jb20&color=%23a78344" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="no"></iframe>
    </Card>
    <Card>
      <p>Card 3</p>
    </Card>
    <Card>
      <p>Card 4</p>
    </Card>
    <Card>
      <p>Card 5</p>
    </Card>
    <Card>
      <p>Card 6</p>
    </Card>
    <Card>
      <p>Card 7</p>
    </Card>
  </div>
</div> -->

