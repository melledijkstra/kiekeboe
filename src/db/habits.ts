import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

export type Habit = {
  name: string
  color: string
  dateCreated: Date
}

export interface PersonalExtensionDB extends DBSchema {
  habits: {
    key: string
    value: Habit
    indexes: { id: number }
  }
}

export async function openDatabase(): Promise<
  IDBPDatabase<PersonalExtensionDB>
> {
  const db = await openDB<PersonalExtensionDB>('PersonalExtensionDB', 1, {
    upgrade: (db) => {
      const store = db.createObjectStore('habits', {
        keyPath: 'id',
        autoIncrement: true
      })
      store.createIndex('id', 'id')
    }
  })

  return db
}

export async function addHabit(
  db: IDBPDatabase<PersonalExtensionDB>,
  habit: Habit
) {
  const tx = db.transaction('habits', 'readwrite')

  await tx.store.add(habit)

  await tx.done
}

export async function getAllHabits(
  db: IDBPDatabase<PersonalExtensionDB>
): Promise<Habit[]> {
  return await db.getAll('habits')
}
