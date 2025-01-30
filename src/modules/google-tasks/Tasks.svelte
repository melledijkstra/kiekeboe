<script lang="ts">
  import browser from 'webextension-polyfill'
  import { TasksClient } from "@/api/google/tasks"
  import TextButton from "@/components/TextButton.svelte"
  import { log } from "@/logger"
  import { getAuthTokenChrome } from "@/oauth2/auth"
  import { onMount } from "svelte"
  import { tasks } from '@/stores/tasks.svelte'
  import Button from '@/components/Button.svelte'

  let open = $state(false)
  let token = $state<string>()
  let taskClient = $state<TasksClient | null>(null)
  let inputTask = $state('')

  async function loadTasks() {
    const data = await taskClient?.fetchTasks()
    log('tasks loaded', $tasks)
    if (data) {
      $tasks = data
    }
  }

  async function createTask(e: KeyboardEvent) {
    if (e.key === 'Enter' && inputTask) {
      const newTask = await taskClient?.createTask(inputTask)
      if (newTask) {
        $tasks = [newTask, ...$tasks]
      }
      inputTask = ''
    }
  }

  const toggleTask = async (event: Event, taskId: string) => {
    const status = (event.target as HTMLInputElement).checked ? 'completed' : 'needsAction'
    const updatedTask = await taskClient?.setTaskStatus(taskId, status)
    if (updatedTask) {
      $tasks = $tasks.map((task) => task.id === taskId ? updatedTask : task)
    }
  }

  async function triggerAuthFlow() {
    token = await getAuthTokenChrome(true)
    if (token) {
      loadTasks()
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

<div class="relative">
  <TextButton onclick={() => open = !open}>Tasks</TextButton>
  <div
    class={[
      open ? 'block' : 'hidden',
      "absolute bottom-8 overflow-y-auto right-0 max-h-96 min-w-80 rounded-lg bg-slate-950/80 p-4"
    ]}>
    {#if token}
      <h3 class="inline-flex items-center text-lg text-white">
        <img class="mr-2 h-4 w-auto" src={browser.runtime.getURL('icons/google-tasks.svg')} alt="google task icon" />
        Tasks
      </h3>
      <ul class="task-list">
        {#each $tasks as task (task.id)}
          <li class="flex items-center gap-1 my-1 text-sm text-white">
            <input
              type="checkbox"
              onchange={(event) => toggleTask(event, task.id)} checked={task.status === 'completed'} />
            {task.title}
          </li>
        {/each}
        <input bind:value={inputTask} onkeypress={createTask} class="mt-1 border-none outline-none text-sm bg-transparent text-white" type="text" placeholder="New task" />
      </ul>
    {:else}
      <Button onclick={triggerAuthFlow}>
        <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
          <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
        </svg>
        Sign in with Google
      </Button>
    {/if}
  </div>
</div>
