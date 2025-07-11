<script>
  import Panel from '@/components/atoms/Panel.svelte'
  import { formatDate } from '@/date'
  import { notes } from '@/stores/notes.svelte'
  import NotesForm from './NotesForm.svelte'
  import { Separator } from 'bits-ui'
</script>

<Panel class="overflow-auto">
  <NotesForm />
  <ul>
    {#each $notes as note, i (i)}
      <li class="text-white">
        <h4 class="text-lg">
          {note.title} -
          <span class="text-sm text-gray-200"
            >{formatDate(note.dateCreated)}</span
          >
        </h4>
        <p class="text-sm">{note.text}</p>
        <Separator.Root orientation="horizontal"
          class={[
            "bg-white my-2 shrink-0",
            "data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[1px]"
          ]}
        />
      </li>
    {/each}
  </ul>
</Panel>
