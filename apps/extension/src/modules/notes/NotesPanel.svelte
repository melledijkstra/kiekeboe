<script>
  import Panel from "@/components/atoms/Panel.svelte"
  import { formatDate } from "@/date"
  import { notes } from "@/stores/notes.svelte"
  import NotesForm from "./NotesForm.svelte"
</script>

<Panel>
  <NotesForm />
  <ul>
    {#each $notes as note, i (i)}
      <li class="text-white border-t-[1px]">
        <h4 class="text-lg">
          {note.title}
          <span class="text-sm text-gray-500"
            >{formatDate(note.dateCreated)}</span
          >
        </h4>
        <p class="text-sm">{note.text}</p>
      </li>
    {/each}
  </ul>
</Panel>
