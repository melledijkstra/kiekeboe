import { type Note } from "@/db/notes";
import type { DbStore } from "@/stores/createDbStore";

export class NotesController {
  constructor(protected store: DbStore<Note>) {}

  async addNote(note: Note) {
    this.store.add(note)
  }
}
