import { openDB, type DBSchema } from "idb"
import type { Habit } from "./habits"
import type { Note } from "./notes"

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
}

export const dbPromise = openDB<PersonalExtensionDB>('PersonalExtensionDB', 2, {
  upgrade: (db) => {
    if (!db.objectStoreNames.contains('habits')) {
      const habitStore = db.createObjectStore('habits', {
        keyPath: 'id',
        autoIncrement: true
      })
      habitStore.createIndex('id', 'id')
    }
    if (!db.objectStoreNames.contains('notes')) {
      const notesStore = db.createObjectStore('notes', {
        keyPath: 'id',
        autoIncrement: true
      })
      notesStore.createIndex('id', 'id')
    }
  }
})
