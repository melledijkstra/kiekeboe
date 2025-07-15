import type { Module } from '@/modules'
import Weather from './Weather.svelte'
import WeatherMenuItem from './Weather.svelte'

const module: Module = {
  component: Weather,
  trigger: WeatherMenuItem
}

export default module
