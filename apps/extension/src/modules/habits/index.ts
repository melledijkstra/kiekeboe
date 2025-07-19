import type { Module } from '@/modules'
import Habits from './HabitsTrigger.svelte'
import HabitsScene from './HabitsScene.svelte'
import HabitsTrigger from './HabitsTrigger.svelte'
import { habits } from '@/stores/habits.svelte'

const habitsModule: Module = {
  component: Habits,
  scene: HabitsScene,
  trigger: HabitsTrigger,
  init: () => {
    habits.initialize()
  }
}

export default habitsModule
