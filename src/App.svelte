<script lang="ts">
  import { fade } from 'svelte/transition'
  import Clock from './Clock.svelte'
  import Curtain from './Curtain.svelte'
  import Welcome from './Welcome.svelte'
  import { onMount, type Component } from 'svelte'
  import { getSettings } from './settings'
  import { appState } from '@/app-state.svelte.ts'
  import { mdiCameraRetakeOutline, mdiTuneVertical } from '@mdi/js'
  import { loadImage, refreshDailyImage } from '@/api/unsplash'
  import { loadModule } from './modules/index.ts'
  import TopBar from './components/TopBar.svelte'
  import IconButton from './components/IconButton.svelte'
  import SettingsMenu from './settings/Menu.svelte'
  import { clickOutside } from './actions/click-outside.ts'
  
  let ModCommandCenter: Component | null = $state(null)
  let ModBreathing: Component | null = $state(null)
  let ModPomodoro: Component | null = $state(null)

  let settingsOpen = $state(false)

  onMount(async () => {
    const appSettings = await getSettings()
    appState.settings = appSettings

    if (appSettings.modules.command_center) {
      const module = await loadModule('command_center')
      ModCommandCenter = module.component
    }

    if (appSettings.modules.pomodoro) {
      const module = await loadModule('pomodoro')
      ModPomodoro = module.component
    }

    if (appSettings.modules.well_being) {
      const module = await loadModule('well_being')
      if (module.scene) {
        ModBreathing = module.scene
      }
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

<!-- Grid playground: https://play.tailwindcss.com/qTwjNWVyU1 -->
<div class="grid h-screen animate-fade-in">
  <!-- TOP --->
  <TopBar />
  <!-- MIDDLE --->
  {#key appState.mode}
    <main
      transition:fade={{ duration: 200 }}
      style="grid-area: 2 / 1"
      class="text-center place-self-center">
      {#if appState.mode === 'default'}
        <Clock />
        <Welcome />
      {:else if appState.mode === 'breathing'}
        <ModBreathing />
      {:else if appState.mode === 'pomodoro'}
        <ModPomodoro />
      {:else}
        <p class="text-white text-lg">Not yet implemented!</p>
      {/if}
    </main>
  {/key}
  <!-- BOTTOM -->
  <footer class="flex flex-row content-end items-end gap-5 p-5">
    <!-- BOTTOM LEFT -->
    <div class="relative" use:clickOutside={() => settingsOpen = false}>
      <IconButton onclick={() => settingsOpen = !settingsOpen} icon={mdiTuneVertical} />
      <SettingsMenu open={settingsOpen} />
    </div>
    <IconButton onclick={refreshBackround} icon={mdiCameraRetakeOutline} />
  </footer>
</div>


