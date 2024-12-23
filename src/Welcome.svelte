<script lang="ts">
  import { onMount } from "svelte"
  import { getWelcomeMessage, retrieveUsername, storeUsername } from "./ui"

  let nameLoaded = $state(false)
  let nameInput = $state('')
  let name = $state<string | null>(null)

  onMount(() => {
    retrieveUsername().then((username) => {
      name = username
      nameLoaded = true
    })
  })
</script>

<style>
  h2 {
    @apply text-white text-5xl;
  }

  /** make sure to render some space when loading in the welcome message to avoid flickering */
  h2:empty {
    @apply min-h-12;
  }
</style>

<h2>
{#if name}
  {getWelcomeMessage(name)}
{:else if nameLoaded}
    What is your name?
    <input
      class="outline-none min-w-5 max-w-max p-1 border-b-2 border-white bg-transparent"
      name="username"
      type="text"
      bind:value={nameInput}
      onkeypress={(event) => {
        if (event.key === 'Enter' && nameInput) {
          storeUsername(nameInput)
          name = nameInput
        }
      }} />
{/if}
</h2>