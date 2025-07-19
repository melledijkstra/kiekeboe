import { addNote, getAllNotes, type Note } from '@/db/notes'
import { DbStore } from './createDbStore'

export const notes = new DbStore<Note>(getAllNotes, addNote, async () => {}, async () => {})
