<script lang="ts">
  import type { Task } from "@/api/definitions/google"
  import { GoogleTasksController } from "@/controllers/GoogleTasksController"
  import { state } from "@/modules/google-tasks/state.svelte"
  import { settingsStore } from "@/settings/index.svelte"
  import { createQuery } from "@tanstack/svelte-query"
  import type { ChangeEventHandler } from "svelte/elements"
  import { derived, type Readable } from "svelte/store"

  const taskListId = '@default';

  const controller = new GoogleTasksController(state)

  const tasksQuery = createQuery({
    queryKey: ['google', 'tasks', taskListId],
    queryFn: async () => controller.getTasks(taskListId),
    staleTime: 60_000
  })

  const currentTask: Readable<Task | null> = derived(tasksQuery, ($query) => {
    if (!$query.isSuccess) {
      return null;
    }
    return $query.data?.find((task) => task.status === 'needsAction') ?? null
  })

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.currentTarget.checked) {
      console.log('CHECK CHECK')
      // handle checked event
    }
  }
</script>

{#if $settingsStore.ui.showCurrentTask && $currentTask}
  <input type="checkbox" class="scale-150 text-white mr-1" onchange={onChange} />
  <span class="text-white text-lg antialiased drop-shadow-md text-shadow-lg/20">{$currentTask.title}</span>
{/if}