<script lang="ts">
  import { fade } from 'svelte/transition'
  import Clock from './Clock.svelte'
  import Curtain from './Curtain.svelte'
  import Welcome from './Welcome.svelte'
  import { onMount } from 'svelte'
  import { settingsStore, syncSettingsStoreWithStorage } from './settings'
  import { appState } from '@/app-state.svelte.ts'
  import { mdiCameraRetakeOutline, mdiTuneVertical } from '@mdi/js'
  import { UnsplashClient } from '@/api/unsplash'
  import { loadModule } from '@/modules'
  import TopBar from './components/topbar/TopBar.svelte'
  import IconButton from './components/IconButton.svelte'
  import SettingsMenu from './settings/Menu.svelte'
  import { clickOutside } from './actions/click-outside.ts'
  import { tasks } from './stores/tasks.svelte.ts'
  import Toasts from './components/Toasts.svelte'
  import FloatMenu from './components/FloatMenu.svelte'

  let unsplashClient = $state(new UnsplashClient())

  let currentTask = $derived(
    $tasks.find((task) => task.status === 'needsAction')
  )

  let settingsOpen = $state(false)

  onMount(async () => {
    await syncSettingsStoreWithStorage()
  })

  async function refreshBackround() {
    const url = await unsplashClient.refreshDailyImage()
    if (url) {
      unsplashClient.loadImage(url)
    }
  }
</script>

<svelte:head>
  <title>{appState.title}</title>
</svelte:head>

<Curtain />

<Toasts position="top-left" />

<!-- Grid playground: https://play.tailwindcss.com/qTwjNWVyU1 -->
<div class="grid h-screen animate-fade-in">
  <!-- TOP --->
  <TopBar />
  <!-- MIDDLE --->
  {#key appState.mode}
    <main
      transition:fade={{ duration: 200 }}
      style="grid-area: 2 / 1"
      class="text-center place-self-center"
    >
      {#if appState.mode === 'default'}
        <Clock />
        <Welcome />
        <div class="mt-4 text-lg empty:h-7">
          {#if $settingsStore.ui.showCurrentTask && currentTask}
            <input type="checkbox" class="scale-150 text-white mr-1" disabled />
            <span class="text-white text-lg">{currentTask.title}</span>
          {/if}
        </div>
      {:else if appState.mode === 'breathing'}
        {#await loadModule('well_being') then Module}
          <Module.scene />
        {/await}
      {:else if appState.mode === 'pomodoro'}
        {#await loadModule('pomodoro') then Module}
          <Module.scene />
        {/await}
      {:else}
        <p class="text-white text-lg">Not yet implemented!</p>
      {/if}
    </main>
  {/key}
  <!-- BOTTOM -->
  <footer class="flex flex-row justify-between content-end items-end p-5">
    <!-- BOTTOM LEFT -->
    <div class="flex flex-row gap-3">
      <div class="relative" use:clickOutside={() => (settingsOpen = false)}>
        <IconButton
          onclick={() => (settingsOpen = !settingsOpen)}
          icon={mdiTuneVertical}
        />
        <FloatMenu
          open={settingsOpen}
          nopadding
          class="flex flex-row overflow-hidden w-[500px] h-96"
        >
          <SettingsMenu />
        </FloatMenu>
      </div>
      <IconButton onclick={refreshBackround} icon={mdiCameraRetakeOutline} />
    </div>
    <div class="flex flex-row gap-5">
      {#if $settingsStore.modules.notes}
        {#await loadModule('notes') then Module}
          <Module.component />
        {/await}
      {/if}
      {#if $settingsStore.modules.google_tasks}
        {#await loadModule('google_tasks') then Module}
          <Module.component />
        {/await}
      {/if}
    </div>
  </footer>
</div>

{#if $settingsStore.modules.command_center}
  {#await loadModule('command_center') then Module}
    {@const CommandCenter = Module.component}
    <CommandCenter />
  {/await}
{/if}
