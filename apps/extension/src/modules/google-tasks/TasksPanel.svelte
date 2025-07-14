<script lang="ts">
  import { TasksClient } from '@/api/google/tasks'
  import PopPanel from '@/components/atoms/PopPanel.svelte'
  import AuthButton from '@/components/AuthButton.svelte'
  import { log } from '@/logger'
  import { AuthClient } from '@/oauth2/auth'
  import { GoogleAuthProvider } from '@/oauth2/providers'
  import { tasks } from '@/stores/tasks.svelte'
  import { onMount } from 'svelte'

  const authClient = new AuthClient(new GoogleAuthProvider())

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
    token = await authClient.getAuthToken()
    if (token) {
      taskClient = new TasksClient(token)
      loadTasks()
    }
  })
</script>

<PopPanel panelProps={{ size: 'small' }}>
  {#if token}
    <h3 class="inline-flex items-center text-lg">
      <img
        class="mr-2 h-4 w-auto"
        src="icons/google-tasks.svg"
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
        class="mt-1 border-none outline-hidden text-sm bg-transparent"
        type="text"
        placeholder="New task"
      />
    </ul>
  {:else}
    <p class="mb-2">In order to see your tasks, you will need to sign in with Google</p>
    <AuthButton provider="google" onclick={triggerAuthFlow} />
  {/if}
</PopPanel>
