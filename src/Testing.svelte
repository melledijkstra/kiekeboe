<script>
  import { writable } from 'svelte/store'

  // Get the value out of storage on load.
  const stored = localStorage.getItem('content')
  // or localStorage.getItem('content')

  // Set the stored value or a sane default.
  export const content = writable(stored || 'Hello, World!')

  // Anytime the store changes, update the local storage value.
  content.subscribe((value) => localStorage.setItem('content', value))
</script>

<p>{$content}</p>

<input bind:value={$content} />
