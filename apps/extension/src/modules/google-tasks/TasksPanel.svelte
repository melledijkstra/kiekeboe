<script lang="ts">
  import AuthButton from '@/components/AuthButton.svelte'
  import { GoogleTasksController } from '@/controllers/GoogleTasksController'
  import { state as tasksState } from '@/modules/google-tasks/state.svelte'
  import { onMount } from 'svelte'
  import PopPanel from '@/components/atoms/PopPanel.svelte'
  import TaskList from '@/components/atoms/tasks/TaskList.svelte'

  let tasksController = $state(new GoogleTasksController(tasksState))
  let selectedTaskList = $state<string>('')
  let isAuthenticated = $state(false)

  async function loadTaskLists() {
    const lists = await tasksController.getTaskLists()
    if (lists) {
      if (!selectedTaskList && lists.length > 0) {
        selectedTaskList = lists[0].id
        await tasksController.getTasks(selectedTaskList)
      }
    }
  }

  async function triggerAuthFlow() {
    const success = await tasksController.auth.authenticate()
    if (success) {
      await loadTaskLists()
    }
  }

  onMount(async () => {
    await tasksController.initialize()
    isAuthenticated = await tasksController.auth.isAuthenticated()
    loadTaskLists()
  })
</script>

<PopPanel panelProps={{ size: 'small' }}>
  {#if isAuthenticated}
    <h3 class="flex items-center text-lg text-black dark:text-white">
      <img
        class="mr-2 h-4 w-auto"
        src="icons/google-tasks.svg"
        alt="google task icon"
      />
      Tasks
    </h3>
    <select class="mt-2 w-full text-black dark:text-white" bind:value={selectedTaskList} onchange={() => tasksController.getTasks(selectedTaskList)}>
      {#each tasksState.taskLists as list (list.id)}
        <option value={list.id}>{list.title}</option>
      {/each}
    </select>
    <TaskList
      tasks={tasksState.tasks}
      onToggleTask={(taskId, status) => tasksController.setTaskStatus(taskId, status, selectedTaskList)}
      onSaveEdit={(task) => tasksController.updateTask(task, selectedTaskList)}
      onRemoveTask={(taskId) => tasksController.deleteTask(taskId, selectedTaskList)}
      onCreateTask={(taskTitle) => tasksController.createTask(taskTitle, selectedTaskList)}
    />
  {:else}
    <p class="mb-2">In order to see your tasks, you will need to sign in with Google</p>
    <AuthButton provider="google" onclick={triggerAuthFlow} />
  {/if}
</PopPanel>
