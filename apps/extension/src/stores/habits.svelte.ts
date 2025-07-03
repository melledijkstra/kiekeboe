import { addHabit, getAllHabits, type Habit } from '@/db/habits'
import { createDbStore } from './createDbStore'

export const habits = createDbStore<Habit>(getAllHabits, addHabit)
