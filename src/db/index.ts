import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase, StoreNames, StoreValue } from 'idb'
import type { Habit } from './habits'
import type { Note } from './notes'
import type { FocusSession } from './focus'
import { Logger } from '@/logger'

export const logger = new Logger('db')

export interface PersonalExtensionDB extends DBSchema {
  habits: {
    key: string
    value: Habit
    indexes: { id: number }
  }
  notes: {
    key: string
    value: Note
    indexes: { id: number }
  }
  focus: {
    key: number
    value: FocusSession
    indexes: { id: number }
  }
}

type StoreName = StoreNames<PersonalExtensionDB>

async function createSimpleDB(
  db: IDBPDatabase<PersonalExtensionDB>,
  dbName: StoreName
) {
  if (!db.objectStoreNames.contains(dbName)) {
    const store = db.createObjectStore(dbName, {
      keyPath: 'id',
      autoIncrement: true
    })
    store.createIndex('id', 'id')
  }
}

export const dbPromise = openDB<PersonalExtensionDB>('PersonalExtensionDB', 7, {
  upgrade: async (db) => {
    await createSimpleDB(db, 'habits')
    await createSimpleDB(db, 'notes')
    await createSimpleDB(db, 'focus')
  }
})

export async function storeInDB<DBName extends StoreNames<PersonalExtensionDB>>(
  dbName: DBName,
  value: StoreValue<PersonalExtensionDB, DBName>
) {
  const db = await dbPromise
  const tx = db.transaction(dbName, 'readwrite')

  await tx.store.add(value)

  await tx.done
}
