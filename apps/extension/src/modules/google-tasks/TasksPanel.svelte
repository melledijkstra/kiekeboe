<script lang="ts">
  import AuthButton from '@/components/AuthButton.svelte'
  import { GoogleTasksController } from '@/controllers/GoogleTasksController'
  import { state as tasksState } from '@/modules/google-tasks/state.svelte'
  import { onMount } from 'svelte'
  import PopPanel from '@/components/atoms/PopPanel.svelte'
  import TasksPanelContent from './TasksPanelContent.svelte'

  let tasksController = $state(new GoogleTasksController(tasksState))
  let isAuthenticated = $state(false)

  async function triggerAuthFlow() {
    isAuthenticated = await tasksController.auth.authenticate()
  }

  onMount(async () => {
    await tasksController.initialize()
    isAuthenticated = await tasksController.auth.isAuthenticated()
  })
</script>

<PopPanel panelProps={{ size: 'small', class: 'flex flex-col' }}>
  {#if isAuthenticated}
    <TasksPanelContent controller={tasksController} state={tasksState} />
  {:else}
    <p class="mb-2">In order to see your tasks, you will need to sign in with Google</p>
    <AuthButton provider="google" onclick={triggerAuthFlow} />
  {/if}
</PopPanel>
