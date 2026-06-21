import { addHabit, deleteHabit, updateHabit, getAllHabits, type Habit } from '@/db/habits'
import { DbStore } from './databaseStore.svelte'

export const habits = new DbStore<Habit>(getAllHabits, addHabit, updateHabit, deleteHabit)
