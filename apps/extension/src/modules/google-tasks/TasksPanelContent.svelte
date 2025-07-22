<script lang="ts">
  import TaskList from '@/components/atoms/tasks/TaskList.svelte'
  import type { TaskControllerInterface } from '@/controllers/GoogleTasksController'
  import { onMount } from 'svelte'
  import type { GoogleTasksState } from './state.svelte'

  export type TasksPanelContentProps = {
    controller: TaskControllerInterface
    state: GoogleTasksState
  }

  let { controller, state: tasksState }: TasksPanelContentProps = $props()

  let selectedTaskList = $state<string>()
  let newTaskTitle = $state('')

  async function loadTaskLists() {
    const lists = await controller.getTaskLists()
    if (lists) {
      if (!selectedTaskList && lists.length > 0) {
        selectedTaskList = lists[0].id
        await controller.getTasks(selectedTaskList)
      }
    }
  }

  onMount(async () => {
    loadTaskLists()
  })
</script>

<h3 class="flex items-center text-lg text-black dark:text-white">
  <img
    class="mr-2 h-4 w-auto"
    src="icons/google-tasks.svg"
    alt="google task icon"
  />
  Tasks
</h3>
<select
  class="my-2 w-full text-black dark:text-white"
  bind:value={selectedTaskList}
  onchange={() => controller.getTasks(selectedTaskList)}
>
  {#each tasksState.taskLists as list (list.id)}
    <option value={list.id}>{list.title}</option>
  {/each}
</select>
<TaskList
  tasks={tasksState.tasks}
  onToggleTask={(taskId, status) =>
    controller.setTaskStatus(taskId, status, selectedTaskList)}
  onSaveEdit={(task) => controller.updateTask(task, selectedTaskList)}
  onRemoveTask={(taskId) => controller.deleteTask(taskId, selectedTaskList)}
/>
<input
  bind:value={newTaskTitle}
  onkeypress={(e) => {
    if (e.key === 'Enter' && newTaskTitle) {
      controller.createTask(newTaskTitle, selectedTaskList)
      newTaskTitle = ''
    }
  }}
  class="mt-1 border-none outline-hidden text-sm bg-transparent text-white"
  type="text"
  placeholder="New task"
/>
