import { dbPromise, storeInDB } from '@/db'

export type Habit = {
  name: string
  color: string
  dateCreated: Date
}

export async function addHabit(habit: Habit) {
  await storeInDB('habits', habit)
}

export async function getAllHabits(): Promise<Habit[]> {
  const db = await dbPromise
  return await db.getAll('habits')
}
