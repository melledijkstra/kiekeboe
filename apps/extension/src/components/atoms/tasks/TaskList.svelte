<script lang="ts">
  import type { Task } from '@/api/definitions/google'
  import TaskItem from './TaskItem.svelte'

  export type TaskListProps = {
    tasks: Task[]
    onSaveEdit: (task: Task) => void
    onRemoveTask: (taskId: string) => void
    onToggleTask: (taskId: string, status: boolean) => void
  }

  const {
    tasks,
    onSaveEdit,
    onRemoveTask,
    onToggleTask
  }: TaskListProps = $props()
</script>

<div class="overflow-y-auto flex-1 min-h-0">
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