<script lang="ts">
  import { onMount } from 'svelte'
  import { WeatherClient, type WeatherInfo } from '@/api/weather'
  import Icon from '@/components/atoms/Icon.svelte'
  import { mdiCloudOff } from '@mdi/js'
  import { weatherToMdiIcon } from './utils'
  import IconButton from '@/components/atoms/IconButton.svelte'

  let currentWeather = $state<WeatherInfo>()
  let client = $state<WeatherClient>()

  onMount(async () => {
    client = new WeatherClient()
    currentWeather = await client?.getWeather()
  })

  function formatCelcius(kelvin: number): string {
    return `${Math.round(kelvin - 273.15)}°`
  }
</script>

<div class="flex flex-col items-end text-white">
  {#if currentWeather}
    <div class="flex flex-row items-center gap-1">
      <Icon path={weatherToMdiIcon(currentWeather.icon)} size={24} />
      <span class="text-lg">{formatCelcius(currentWeather.temperature)}</span>
    </div>
    <span
      class="text-xs max-w-16 overflow-hidden text-ellipsis whitespace-nowrap"
      >{currentWeather.location}</span
    >
  {:else}
    <IconButton icon={mdiCloudOff} tooltip="Weather" onclick={() => alert('Not implemented yet!')} />
  {/if}
</div>
