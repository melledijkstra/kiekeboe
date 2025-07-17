<script lang="ts">
  import { getMomentOfDay, retrieveUsername, storeUsername, clearUsername } from "@/ui"
  import { repeatEvery } from "@/time/utils"
  import { onMount } from "svelte"

  const MINUTE = 60 * 1000

  let nameInput = $state('')
  let username = $state<string>()
  let dayPart = $state(getMomentOfDay())
  let cancelTimer = $state<() => void>()
  let retrieveUsernamePromise = retrieveUsername

  $effect(() => {
    cancelTimer = repeatEvery(() => {
      if (username) {
        dayPart = getMomentOfDay()
      }
    }, MINUTE)

    return () => cancelTimer?.()
  })

  onMount(async () => {
    username = await retrieveUsernamePromise()
  })

  function forgetUsername() {
    clearUsername()
    username = undefined
  }
</script>

{#snippet prompt()}
  <span class="inline-block">What is your name?&nbsp;</span>
  <span class="inline p-2 -m-2 relative">
    <input
      class="username-input block border-white border-b-2 absolute p-2 top-0 left-0 right-0 bottom-0"
      name="username"
      type="text"
      spellcheck="false"
      autocomplete="username"
      bind:value={nameInput}
      onkeypress={(event) => {
        if (event.key === 'Enter' && nameInput) {
          storeUsername(nameInput)
          username = nameInput
        }
      }} />
      <span class="username-input inline-block invisible min-h-[1em]">{nameInput.replace(/ /g, '\u00A0')}</span>
  </span>
{/snippet}

<!-- make sure to render some space when loading in the welcome message to avoid flickering -->
<h2 class="text-white text-5xl antialiased empty:min-h-18 text-shadow-lg/30 leading-normal">
  {#await retrieveUsernamePromise() then}
    {#if username}
      <span>Good {dayPart}, <button class="cursor-pointer hover:line-through text-shadow-lg/30" onclick={forgetUsername}>{username}</button></span>
    {:else if !username}
      {@render prompt()}
    {/if}
  {/await}
</h2>

<style lang="postcss">
  @reference '../app.css';

  .username-input {
    @apply min-w-[10rem] max-w-[min(100%,12em)] text-shadow-lg/30 whitespace-nowrap align-baseline outline-none leading-normal;
  }
</style>