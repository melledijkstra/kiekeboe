<script lang="ts">
  import { loadModule } from "@/modules"
  import { onMount, type Component } from "svelte"
  import { mdiHomeOutline, mdiRocketLaunch, mdiSpa } from "@mdi/js"
  import { log } from "@/logger"
  import { appState, switchAppMode } from "@/app-state.svelte"
  import Fitbit from "@/modules/fitbit/Fitbit.svelte"
  import Account from "@/Account.svelte"
  import ModeButton from "./ModeButton.svelte"
  import { getSettings, type Settings } from "@/settings"

  let ModSpotify: Component | null = $state(null)
  let ModWorldClocks: Component | null = $state(null)
  let ModCountdown: Component | null = $state(null)
  let ModWeather: Component | null = $state(null)

  let appSettings = $state<Settings>()

  onMount(async () => {
    appSettings = await getSettings()

    log({ appSettings })

    if (appSettings.modules.spotify) {
      const module = await loadModule('spotify')
      ModSpotify = module.component
    }

    if (appSettings.modules.world_clocks) {
      const module = await loadModule('world_clocks')
      ModWorldClocks = module.component
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
</script>

<header class="w-full p-5">
  <div class="float-left flex flex-row items-start justify-start align-middle gap-5">
    <ModeButton onclick={() => switchAppMode('default')} icon={mdiHomeOutline} />
    {#if appSettings?.modules.pomodoro}
      <ModeButton onclick={() => switchAppMode('pomodoro')} icon={mdiRocketLaunch} />
    {/if}
    {#if appSettings?.modules.well_being}
      <ModeButton onclick={() => switchAppMode('breathing')} icon={mdiSpa} />
    {/if}
  </div>
  <div class="float-right flex flex-row items-start justify-end align-middle gap-5">
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
    {#if ModWeather}
      <ModWeather />
    {/if}
    <Account />
  </div>
</header>