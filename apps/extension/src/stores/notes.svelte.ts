import { addNote, getAllNotes, type Note } from '@/db/notes'
import { createDbStore } from './createDbStore'

export const notes = createDbStore<Note>(getAllNotes, addNote)
