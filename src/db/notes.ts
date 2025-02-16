import { dbPromise, storeInDB } from '@/db'

export const DB_NAME = 'notes' as const

export type Note = {
  title: string
  text: string
  dateCreated: Date
}

export async function addNote(note: Note) {
  await storeInDB(DB_NAME, note)
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await dbPromise
  return await db.getAll(DB_NAME)
}
