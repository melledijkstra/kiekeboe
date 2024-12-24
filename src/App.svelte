<script lang="ts">
  import Clock from './Clock.svelte'
  import Curtain from './Curtain.svelte'
  import Account from './Account.svelte'
  import Welcome from './Welcome.svelte'
  import { onMount, type Component } from 'svelte'
  import { getSettings } from './settings'
  import { log } from './logger'
  import { appState } from './app-state.svelte'

  let TasksComponent: Component | null = $state(null);
  let CommandCenter: Component | null = $state(null);

  onMount(async () => {
    const appSettings = await getSettings()
    appState.settings = appSettings

    log({ appSettings })

    if (appSettings.modules.google_tasks) {
      const file = 'Tasks' as const
      const module = await import(`./${file}.svelte`)
      log('module loaded', file)
      TasksComponent = module.default
    }

    if (appSettings.modules.command_center) {
      const file = 'CommandCenter' as const
      const module = await import(`./command-center/${file}.svelte`)
      log('module loaded', file)
      CommandCenter = module.default
    }
  })
</script>

<style lang="postcss">
  :root {
    --background-image: url();
  }

  :global {
    body {
      @apply flex flex-col relative h-screen w-screen overflow-hidden;

      background-color: #000;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: var(--background-image);
    }
  }
</style>

<Curtain />

{#if CommandCenter}
  <CommandCenter />
{/if}

<div class="grid h-full grid-rows-3 grid-rows animate-fade-in">
  <!-- TOP --->
  <div class="justify-self-end">
    <Account />
  </div>
  <!-- MIDDLE --->
  <div class="justify-self-center self-center text-center">
    <Clock />
    <Welcome />
  </div>
  <!-- BOTTOM -->
  <div class="justify-self-end self-end"> 
    {#if TasksComponent}
      <TasksComponent />
    {/if}
  </div>
</div>

