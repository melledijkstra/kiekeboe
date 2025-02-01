import { dbPromise } from '@/db'

export const DB_NAME = 'notes' as const

export type Note = {
  title: string
  text: string
  dateCreated: Date
}

export async function addNote(
  note: Note
) {
  const db = await dbPromise
  const tx = db.transaction(DB_NAME, 'readwrite')

  await tx.store.add(note)

  await tx.done
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await dbPromise
  return await db.getAll(DB_NAME)
}
