<script lang="ts">
  import { fade } from 'svelte/transition'
  import Clock from '@/components/Clock.svelte'
  import Curtain from '@/components/Curtain.svelte'
  import Background from '@/components/Background.svelte'
  import Welcome from '@/components/Welcome.svelte'
  import { onMount } from 'svelte'
  import { settings, settingsStore } from '@/settings/index.svelte'
  import { appState } from '@/app-state.svelte.ts'
  import { loadModule } from '@/modules'
  import TopBar from '@/components/topbar/TopBar.svelte'
  import { state as tasksState } from '@/modules/google-tasks/state.svelte'
  import NotificationCenter from '@/components/NotificationCenter.svelte'
  import ImageRefreshButton from '@/components/ImageRefreshButton.svelte'
  import { log } from './logger'
  import SettingsMenuItem from './settings/SettingsMenuItem.svelte'
  import { clearUsername, retrieveUsername, storeUsername } from './browser'
  import ModulesInitializer from './components/ModulesInitializer.svelte'
  import Quotes from './components/atoms/Quotes.svelte'

  let currentTask = $derived(
    tasksState.tasks.find((task) => task.status === 'needsAction')
  )

  onMount(async () => {
    log('App mounted')
    const username = await retrieveUsername()
    if (username) {
      appState.user = {
        name: username
      }
    }
  })

  function onUsernameChange(name: string) {
    storeUsername(name)
    appState.user = {
      name
    }
  }

  function onClearUsername() {
    clearUsername()
    appState.user = undefined
  }
</script>

<svelte:head>
  <title>{appState.title}</title>
</svelte:head>

{#snippet renderCurrentTask()}
  <div class="mt-4 text-lg empty:h-7">
    {#if $settingsStore.ui.showCurrentTask && currentTask}
      <input type="checkbox" class="scale-150 text-white mr-1" disabled />
      <span class="text-white text-lg antialiased drop-shadow-md text-shadow-lg/20">{currentTask.title}</span>
    {/if}
  </div>
{/snippet}

{#await settings.initialize() then}
  <Background />
  <Curtain />

  {#if $settingsStore.modules.command_center}
    {#await loadModule('command_center') then Module}
      <Module.component />
    {/await}
  {/if}

  <ModulesInitializer />

  <NotificationCenter position="bottom-right" />

  <div class="h-screen overflow-y-scroll snap-y snap-mandatory">
    <!-- Grid playground: https://play.tailwindcss.com/1AWUsAQwTi -->
    <section
      class={[
        appState.mode === 'focus' && 'bg-black/70',
        'grid grid-rows-[minmax(0,1fr)_auto_minmax(0,1fr)] snap-start h-screen animate-fade-in transition-colors'
      ]}
    >
      <!-- TOP --->
      <TopBar />
      <!-- MIDDLE --->
      {#key appState.mode}
        <main
          transition:fade
          style="grid-area: 2 / 1"
          class="text-center place-self-center"
        >
          {#if appState.mode === 'default'}
            <Clock />
            {#if appState.user?.name}
              <Welcome
                user={appState.user}
                onUsernameChange={onUsernameChange}
                onClearUsername={onClearUsername} />
            {/if}
            {@render renderCurrentTask()}
          {:else if appState.mode === 'breathing'}
            {#await loadModule('well_being') then Module}
              <Module.scene />
            {/await}
          {:else if appState.mode === 'focus'}
            {#await loadModule('focus') then Module}
              <Module.scene />
            {/await}
          {:else}
            <p class="text-white text-lg">Not yet implemented!</p>
          {/if}
        </main>
      {/key}
      <!-- BOTTOM -->
      <footer class={[
        "flex flex-row justify-between content-end items-end p-6",
        // add vignette effect from to bottom to make icons more visible
        "bg-gradient-to-t from-gray-700/50 from-10% to-transparent",
      ]}>
        <!-- BOTTOM LEFT -->
        <div class="flex flex-row gap-3">
          <SettingsMenuItem />
          <ImageRefreshButton />
        </div>
        {#if $settingsStore.ui.showQuotes && appState.mode !== 'focus'}
          <Quotes />
        {/if}
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
    </section>
    <!-- <section class="h-screen snap-start bg-gray-700/50"> 
    </section> -->
  </div>
{/await}
