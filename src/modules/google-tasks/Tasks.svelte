<script lang="ts">
  import type { Task } from "@/api/definitions/google"
  import { TasksClient } from "@/api/google/tasks"
  import { log } from "@/logger"
  import { getAuthTokenChrome } from "@/oauth2/auth"
  import { onMount } from "svelte"

  let token = $state<string>()
  let taskClient = $state<TasksClient | null>(null)
  let newTask = $state('')
  let tasks = $state<Task[]>([])

  async function loadTasks() {
    const data = await taskClient?.fetchTasks()
    log('tasks loaded', tasks)
    if (data) {
      tasks = data
    }
  }

  function createTask(e: KeyboardEvent) {
    if (e.key === 'Enter' && newTask) {
      tasks = [...tasks, { id: Math.ceil(Math.random() * 100000).toString(), title: newTask, status: 'needsAction' }]
      newTask = ''
    }
  }

  onMount(async () => {
    token = await getAuthTokenChrome(false)
    if (token) {
      taskClient = new TasksClient(token)
      loadTasks()
    }
  })
</script>

<div class="p-4 bottom-5 right-5 rounded-lg bg-slate-950/80">
  <h3 class="text-lg text-white">Tasks</h3>
  <ul class="task-list">
    {#each tasks as task}
      <li class="py-1 m-1 text-sm text-white">
        <input class="translate-y-0.5" type="checkbox" disabled checked={task.status !== 'needsAction'} />
        {task.title}
      </li>
    {/each}
    <input bind:value={newTask} onkeypress={createTask} class="mt-1 border-none outline-none text-sm bg-transparent text-white" type="text" placeholder="New task" />
  </ul>
</div>
