<script lang="ts">
  import browser from 'webextension-polyfill'
  import { TasksClient } from '@/api/google/tasks'
  import TextButton from '@/components/TextButton.svelte'
  import { log } from '@/logger'
  import { AuthClient } from '@/oauth2/auth'
  import { onMount } from 'svelte'
  import { tasks } from '@/stores/tasks.svelte'
  import AuthButton from '@/components/AuthButton.svelte'

  const authClient = new AuthClient('google')

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
    const status = (event.target as HTMLInputElement).checked
      ? 'completed'
      : 'needsAction'
    const updatedTask = await taskClient?.setTaskStatus(taskId, status)
    if (updatedTask) {
      $tasks = $tasks.map((task) => (task.id === taskId ? updatedTask : task))
    }
  }

  async function triggerAuthFlow() {
    token = await authClient.getAuthToken(true)
    if (token) {
      loadTasks()
    }
  }

  onMount(async () => {
    token = await authClient.getAuthToken(false)
    if (token) {
      taskClient = new TasksClient(token)
      loadTasks()
    }
  })
</script>

<div class="relative">
  <TextButton onclick={() => (open = !open)}>Tasks</TextButton>
  <div
    class={[
      open ? 'block' : 'hidden',
      'absolute bottom-8 overflow-y-auto right-0 max-h-96 min-w-80 rounded-lg bg-slate-950/80 p-4'
    ]}
  >
    {#if token}
      <h3 class="inline-flex items-center text-lg text-white">
        <img
          class="mr-2 h-4 w-auto"
          src={browser.runtime.getURL('icons/google-tasks.svg')}
          alt="google task icon"
        />
        Tasks
      </h3>
      <ul class="task-list">
        {#each $tasks as task (task.id)}
          <li class="flex items-center gap-1 my-1 text-sm text-white">
            <input
              type="checkbox"
              onchange={(event) => toggleTask(event, task.id)}
              checked={task.status === 'completed'}
            />
            {task.title}
          </li>
        {/each}
        <input
          bind:value={inputTask}
          onkeypress={createTask}
          class="mt-1 border-none outline-hidden text-sm bg-transparent text-white"
          type="text"
          placeholder="New task"
        />
      </ul>
    {:else}
      <AuthButton provider={'google'} onclick={triggerAuthFlow} />
    {/if}
  </div>
</div>
