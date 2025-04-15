import {
  addHabit,
  getAllHabits,
  type Habit,
} from '@/db/habits'
import { writable } from 'svelte/store'

export const habits = writable<Habit[]>([])

export async function initializeHabits() {
  const loadedHabits = await getAllHabits()
  habits.set(loadedHabits)
}

export async function addNewHabit(habit: Habit) {
  await addHabit(habit)
  const updatedHabits = await getAllHabits()
  habits.set(updatedHabits)
}
