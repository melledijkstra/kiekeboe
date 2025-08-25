<script lang="ts">
  import TaskList from '@/components/atoms/tasks/TaskList.svelte'
  import type { TaskControllerInterface } from '@/controllers/GoogleTasksController'
  import type { GoogleTasksState } from './state.svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import { derived, writable } from 'svelte/store'

  export type TasksPanelContentProps = {
    controller: TaskControllerInterface
    state: GoogleTasksState
  }

  let { controller }: TasksPanelContentProps = $props()

  const selectedTaskList = writable<string | undefined>()

  let newTaskTitle = $state('')
  
  const taskListsQuery = createQuery({
    queryKey: ['google', 'tasklists'],
    queryFn: () => controller.getTaskLists()
  })

  const tasksQuery = createQuery(
    derived(selectedTaskList, (listId) => ({
      queryKey: ['google', 'tasks', listId],
      enabled: !!listId,
      queryFn: () => controller.getTasks(listId)
    })
  ))

  $inspect('list', $selectedTaskList)
</script>

<h3 class="mb-2 flex items-center text-lg text-black dark:text-white">
  <img
    class="mr-2 size-5"
    src="icons/google-tasks.svg"
    alt="google task icon"
  />
  {#if $taskListsQuery.isSuccess}
    <select
      name="task-list-selector"
      class="w-full text-black dark:text-white text-lg"
      bind:value={$selectedTaskList}
    >
      {#each $taskListsQuery.data as list (list.id)}
        <option value={list.id}>{list.title}</option>
      {/each}
    </select>
  {/if}
</h3>
<TaskList
  class="flex-1 overflow-y-auto"
  tasks={$tasksQuery.data ?? []}
  onToggleTask={(taskId, status) =>
    controller.setTaskStatus(taskId, status, $selectedTaskList)}
  onSaveEdit={(task) => controller.updateTask(task, $selectedTaskList)}
  onRemoveTask={(taskId) => controller.deleteTask(taskId, $selectedTaskList)}
/>
<input
  name="new-task-input"
  bind:value={newTaskTitle}
  onkeypress={(e) => {
    if (e.key === 'Enter' && newTaskTitle) {
      controller.createTask(newTaskTitle, $selectedTaskList)
      newTaskTitle = ''
    }
  }}
  class="mt-1 border-none outline-hidden text-sm bg-transparent dark:text-white"
  type="text"
  placeholder="New task"
/>
