<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { getWelcomeMessage, retrieveUsername, storeUsername } from "./ui"
  import { repeatEvery } from "./time/utils"

  const MINUTE = 60 * 1000

  let nameLoaded = $state(false)
  let nameInput = $state('')
  let name = $state<string>()
  let welcomeMessage = $state<string>()

  let cancelTimer = $state<() => void>()

  onMount(async () => {
    const username = await retrieveUsername()
    if (username) {
      name = username
      nameLoaded = true
      welcomeMessage = getWelcomeMessage(username)
    }

    cancelTimer = repeatEvery(() => {
      if (name) {
        welcomeMessage = getWelcomeMessage(name)
      }
    }, MINUTE)
  })

  onDestroy(() => cancelTimer?.())
</script>

<!-- make sure to render some space when loading in the welcome message to avoid flickering -->
<h2 class="text-white text-5xl empty:min-h-12 drop-shadow-xl">
  {#if name}
    {welcomeMessage}
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