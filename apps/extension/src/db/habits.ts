import { addItem, getAllItems } from '@/db/simple'

export type Habit = {
  name: string
  color: string
  dateCreated: Date
}

export async function addHabit(habit: Habit) {
  await addItem('habits', habit)
}

export async function getAllHabits(): Promise<Habit[]> {
  return await getAllItems('habits')
}
