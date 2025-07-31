import { storeInDB, getAllItems } from '@/db'

export const DB_NAME = 'notes' as const

export type Note = {
  id: string
  title: string
  text: string
  dateCreated: Date
}

export async function addNote(note: Note) {
  await storeInDB(DB_NAME, note)
}

export async function getAllNotes(): Promise<Note[]> {
  return await getAllItems(DB_NAME)
}
