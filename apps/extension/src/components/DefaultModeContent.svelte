<script lang="ts">
  import { appState } from '@/app-state.svelte'
  import { storeUsername, clearUsername, retrieveUsername } from '@/browser'
  import Clock from '@/components/Clock.svelte'
  import Welcome from '@/components/Welcome.svelte'
  import { onMount, type Snippet } from 'svelte'

  interface Props {
    user: { name: string } | undefined
    renderCurrentTask: Snippet
  }

  let { user, renderCurrentTask }: Props = $props()

  function onUsernameChange(name: string) {
    storeUsername(name)
    appState.user = {
      name
    }
  }

  function onClearUsername() {
    clearUsername()
    appState.user = undefined
  }

  onMount(async () => {
    const username = await retrieveUsername()
    if (username) {
      appState.user = {
        name: username
      }
    }
  })
</script>

<Clock />
{#if user?.name}
  <Welcome
    {user}
    {onUsernameChange}
    {onClearUsername} />
{/if}
{@render renderCurrentTask()}
