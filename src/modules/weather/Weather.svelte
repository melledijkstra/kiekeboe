<script lang="ts">
  import { WeatherClient, type WeatherInfo } from "@/api/weather"
  import Icon from "@/components/Icon.svelte"
  import { mdiCloudOff } from "@mdi/js"
  import { onMount } from "svelte"
  import { weatherToMdiIcon } from "./utils"

  let currentWeather = $state<WeatherInfo>()
  let client = $state<WeatherClient>()

  onMount(async () => {
    client = new WeatherClient()
    currentWeather = await client?.getWeather()
  })

  function formatCelcius(kelvin: number): string {
    return `${Math.round(kelvin - 273.15)}℃`;
  }

  async function getCurrentWeather() {
    currentWeather = await client?.getWeather()
  }
</script>

<button class="flex flex-col items-end text-white" onclick={getCurrentWeather}>
  {#if currentWeather}
  <div class="flex flex-row items-center gap-1">
    <Icon path={weatherToMdiIcon(currentWeather.icon)} size={24} />
    <span>{formatCelcius(currentWeather.temperature)}</span>
  </div>
  <span>{currentWeather.location}</span>
  {:else}
    <Icon path={mdiCloudOff} size={46} />
  {/if}
</button>
