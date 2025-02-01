import { dbPromise } from '@/db'

export type Habit = {
  name: string
  color: string
  dateCreated: Date
}

export async function addHabit(
  habit: Habit
) {
  const db = await dbPromise
  const tx = db.transaction('habits', 'readwrite')

  await tx.store.add(habit)

  await tx.done
}

export async function getAllHabits(): Promise<Habit[]> {
  const db = await dbPromise
  return await db.getAll('habits')
}
