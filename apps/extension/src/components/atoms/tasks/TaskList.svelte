<script lang="ts">
  import type { Task } from '@/api/definitions/google'
  import TaskItem from './TaskItem.svelte'

  export type TaskListProps = {
    tasks: Task[]
    onSaveEdit: (task: Task) => void
    onRemoveTask: (taskId: string) => void
    onCreateTask: (taskTitle: string) => void
    onToggleTask: (taskId: string, status: boolean) => void
  }

  const {
    tasks,
    onSaveEdit,
    onCreateTask,
    onRemoveTask,
    onToggleTask
  }: TaskListProps = $props()

  let newTaskTitle = $state('')
</script>

<div class="flex flex-col gap-1 h-full">
  <div class="overflow-y-auto flex-1">
    {#if tasks.length === 0}
      <div class="mt-3 text-center text-xs text-gray-400">✨ Add a task to get started ✨</div>
    {:else}
      <ul>
        {#each tasks as task (task.id)}
          <li>
            <TaskItem
              task={task}
              onToggleTask={onToggleTask}
              onRemoveTask={onRemoveTask}
              onSaveEdit={onSaveEdit}
            />
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  <input
    bind:value={newTaskTitle}
    onkeypress={(e) => {
      if (e.key === 'Enter' && newTaskTitle) {
        onCreateTask(newTaskTitle)
        newTaskTitle = ''
      }
    }}
    class="mt-1 border-none outline-hidden text-sm bg-transparent text-white"
    type="text"
    placeholder="New task"
  />
</div>