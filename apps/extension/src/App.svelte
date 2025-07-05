<script lang="ts">
  import { fade } from 'svelte/transition'
  import Clock from '@/components/Clock.svelte'
  import Curtain from '@/components/Curtain.svelte'
  import Welcome from '@/components/Welcome.svelte'
  import { onMount } from 'svelte'
  import { settings, settingsStore } from '@/settings/index.svelte'
  import { appState } from '@/app-state.svelte.ts'
  import { mdiTuneVertical } from '@mdi/js'
  import { loadModule } from '@/modules'
  import TopBar from '@/components/topbar/TopBar.svelte'
  import SettingsMenu from '@/components/SettingsMenu.svelte'
  import { tasks } from '@/stores/tasks.svelte.ts'
  import Toasts from '@/components/Toasts.svelte'
  import Panel from '@/components/atoms/Panel.svelte'
  import Icon from '@/components/atoms/Icon.svelte'
  import ImageRefreshButton from '@/components/ImageRefreshButton.svelte'
  import { Popover } from 'bits-ui'
  import { log } from './logger'

  let currentTask = $derived(
    $tasks.find((task) => task.status === 'needsAction')
  )

  onMount(async () => {
    log('App mounted')
  })
</script>

<svelte:head>
  <title>{appState.title}</title>
</svelte:head>

{#await settings.initialize()}
  <p>Loading settings...</p>
{:then}
  <Curtain />

  <Toasts position="top-left" />

  <!-- Grid playground: https://play.tailwindcss.com/qTwjNWVyU1 -->
  <div
    class={[
      appState.mode === 'focus' && 'bg-zinc-700/40',
      'grid h-screen animate-fade-in transition-colors'
    ]}
  >
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
      "flex flex-row justify-between content-end items-end p-5",
      // add vignette effect from to bottom to make icons more visible
      "bg-gradient-to-t from-gray-700/50 from-10% to-transparent",
    ]}>
      <!-- BOTTOM LEFT -->
      <div class="flex flex-row gap-3">
        <Popover.Root>
          <Popover.Trigger class={[
            'dark:text-white/70 dark:hover:text-white text-zinc-500 hover:text-zinc-700',
            'block cursor-pointer transition-colors',
          ]}>
            <Icon path={mdiTuneVertical} size={40} />
          </Popover.Trigger>
          <Panel nopadding class='w-[550px] h-80'>
            <SettingsMenu />
          </Panel>
        </Popover.Root>
        <ImageRefreshButton />
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
      <Module.component />
    {/await}
  {/if}
{/await}
