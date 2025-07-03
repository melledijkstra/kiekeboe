import { addItem, getAllItems } from '@/db/simple'

export const DB_NAME = 'notes' as const

export type Note = {
  title: string
  text: string
  dateCreated: Date
}

export async function addNote(note: Note) {
  await addItem(DB_NAME, note)
}

export async function getAllNotes(): Promise<Note[]> {
  return await getAllItems(DB_NAME)
}
