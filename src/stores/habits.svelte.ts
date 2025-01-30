import {
  addHabit,
  getAllHabits,
  openDatabase,
  type Habit,
  type PersonalExtensionDB
} from '@/db/habits'
import type { IDBPDatabase } from 'idb'
import { writable } from 'svelte/store'

export const habits = writable<Habit[]>([])

let db: IDBPDatabase<PersonalExtensionDB>

export async function initializeHabits() {
  db = await openDatabase()
  const loadedHabits = await getAllHabits(db)
  habits.set(loadedHabits)
}

export async function addNewHabit(habit: Habit) {
  await addHabit(db, habit)
  const updatedHabits = await getAllHabits(db)
  habits.set(updatedHabits)
}
