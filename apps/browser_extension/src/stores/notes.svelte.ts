import { addNote, getAllNotes, type Note } from "@/db/notes";
import { writable } from "svelte/store";

export const notes = writable<Note[]>([])

export async function initializeNotes() {
  const loadedHabits = await getAllNotes()
  notes.set(loadedHabits)
}

export async function addNewNote(note: Note) {
  await addNote(note)
  const updatedHabits = await getAllNotes()
  notes.set(updatedHabits)
}