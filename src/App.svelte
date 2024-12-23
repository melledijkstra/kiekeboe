<script lang="ts">
  import Clock from './Clock.svelte'
  import Curtain from './Curtain.svelte'
  import Account from './Account.svelte'
  import Welcome from './Welcome.svelte'
  import { onMount, type Component } from 'svelte'
  import { getSettings, type Settings } from './settings'
  import { log } from './logger'

  let TasksComponent: Component | null = $state(null);
  let appSettings = $state<Settings>()

  onMount(async () => {
    appSettings = await getSettings()

    log({
      tasksEnabled: appSettings.modules.google_tasks
    })

    if (appSettings.modules.google_tasks) {
      const module = await import('./Tasks.svelte')
      log('module loaded', module.default.name)
      TasksComponent = module.default
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

