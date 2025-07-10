<script lang="ts">
  import Button from '@/components/atoms/Button.svelte'
import Input from '@/components/atoms/Input.svelte'
  import { notes } from '@/stores/notes.svelte'

  let inputTitle = $state('')
  let inputText = $state('')

  function createNote() {
    notes.add({
      title: inputTitle,
      text: inputText,
      dateCreated: new Date()
    })
    inputTitle = ''
    inputText = ''
  }
</script>

<h3 class="text-lg text-white mb-2">Create quick note</h3>
<Input
  type="text"
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
<Button class="block my-2 text-white" onclick={createNote}>Save</Button>
