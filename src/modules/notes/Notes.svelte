<script lang="ts">
  import { onMount } from 'svelte'
  import TextButton from '@/components/TextButton.svelte'
  import { addNewNote, initializeNotes, notes } from '@/stores/notes.svelte'
  import { formatDate } from '@/date'

  let open = $state(false)
  let inputTitle = $state('')
  let inputText = $state('')

  function createNote() {
    addNewNote({
      title: inputTitle,
      text: inputText,
      dateCreated: new Date()
    })
    inputTitle = ''
    inputText = ''
  }

  onMount(async () => {
    initializeNotes()
  })
</script>

<div class="relative">
  <TextButton onclick={() => (open = !open)}>Notes</TextButton>
  <div
    class={[
      open ? 'block' : 'hidden',
      'absolute bottom-8 overflow-y-auto right-0 max-h-96 w-xl rounded-lg bg-slate-950/80 p-4'
    ]}
  >
    <h3 class="text-lg text-white">Create quick note</h3>
    <input
      type="text"
      class="my-2"
      placeholder="Note Title"
      bind:value={inputTitle}
    />
    <textarea
      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      rows="4"
      placeholder="Write your thoughts here..."
      bind:value={inputText}
    >
    </textarea>
    <button class="block my-2 text-white" onclick={createNote}>Save</button>
    <ul>
      {#each $notes as note}
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
  </div>
</div>
