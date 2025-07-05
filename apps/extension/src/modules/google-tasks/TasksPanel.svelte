<script lang="ts">
  import { TasksClient } from '@/api/google/tasks'
  import PopPanel from '@/components/atoms/PopPanel.svelte'
  import AuthButton from '@/components/AuthButton.svelte'
  import type { TaskList, Task } from '@/api/definitions/google'
  import { log } from '@/logger'
  import { AuthClient } from '@/oauth2/auth'
  import { GoogleAuthProvider } from '@/oauth2/providers'
  import { tasks } from '@/stores/tasks.svelte'
  import { onMount } from 'svelte'
  
  const authClient = new AuthClient(new GoogleAuthProvider())

  let token = $state<string>()
  let taskClient = $state<TasksClient | null>(null)
  let inputTask = $state('')
  let taskLists = $state<TaskList[]>([])
  let selectedTaskList = $state<string>('')
  let editingTask = $state<string | null>(null)
  let editingTitle = $state('')

  async function loadTaskLists() {
    const data = await taskClient?.getTaskLists()
    if (data) {
      taskLists = data
      if (!selectedTaskList && data.length > 0) {
        selectedTaskList = data[0].id
        await loadTasks()
      }
    }
  }

  async function loadTasks() {
    const data = await taskClient?.fetchTasks(selectedTaskList)
    log('tasks loaded', $tasks)
    if (data) {
      $tasks = data
    }
  }

  async function createTask(e: KeyboardEvent) {
    if (e.key === 'Enter' && inputTask) {
      const newTask = await taskClient?.createTask(inputTask, selectedTaskList)
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
    const updatedTask = await taskClient?.setTaskStatus(taskId, status, selectedTaskList)
    if (updatedTask) {
      $tasks = $tasks.map((task) => (task.id === taskId ? updatedTask : task))
    }
  }

  async function saveEdit(task: Task) {
    if (!editingTitle) return
    const updated = await taskClient?.updateTask(
      { ...task, title: editingTitle },
      selectedTaskList
    )
    if (updated) {
      $tasks = $tasks.map((t) => (t.id === updated.id ? updated : t))
    }
    editingTask = null
    editingTitle = ''
  }

  async function removeTask(taskId: string) {
    const success = await taskClient?.deleteTask(taskId, selectedTaskList)
    if (success) {
      $tasks = $tasks.filter((t) => t.id !== taskId)
    }
  }

  async function triggerAuthFlow() {
    token = await authClient.getAuthToken(true)
    if (token) {
      taskClient = new TasksClient(token)
      await loadTaskLists()
      loadTasks()
    }
  }

  onMount(async () => {
    token = await authClient.getAuthToken()
    if (token) {
      taskClient = new TasksClient(token)
      await loadTaskLists()
      loadTasks()
    }
  })
</script>

<PopPanel panelProps={{ size: 'small' }}>
  {#if token}
    <h3 class="inline-flex items-center text-lg text-white">
      <img
        class="mr-2 h-4 w-auto"
        src="icons/google-tasks.svg"
        alt="google task icon"
      />
      Tasks
    </h3>
    <select class="mb-2 text-black" bind:value={selectedTaskList} onchange={loadTasks}>
      {#each taskLists as list (list.id)}
        <option value={list.id}>{list.title}</option>
      {/each}
    </select>
    <ul class="task-list">
      {#each $tasks as task (task.id)}
        <li class="flex items-center gap-1 my-1 text-sm text-white">
          <input
            type="checkbox"
            onchange={(event) => toggleTask(event, task.id)}
            checked={task.status === 'completed'}
          />
          {#if editingTask === task.id}
            <input
              class="flex-1 bg-transparent border-b text-white"
              bind:value={editingTitle}
              onkeypress={(e) => e.key === 'Enter' && saveEdit(task)}
            />
            <button class="text-xs" onclick={() => saveEdit(task)}>Save</button>
          {:else}
            <button class="flex-1" ondblclick={() => { editingTask = task.id; editingTitle = task.title }}>
              {task.title}
            </button>
          {/if}
          <button class="text-red-500 text-xs" onclick={() => removeTask(task.id)}>x</button>
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
    <p class="mb-2">In order to see your tasks, you will need to sign in with Google</p>
    <AuthButton provider="google" onclick={triggerAuthFlow} />
  {/if}
</PopPanel>
