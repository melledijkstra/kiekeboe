import type { Module } from '@/modules'
import Wellbeing from './WellBeing.svelte'
import Breathing from './Breathing.svelte'

export default {
  component: Wellbeing,
  scene: Breathing
} satisfies Module
