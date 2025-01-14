<script lang="ts">
  import { fetchTasks, type Task } from "@/google/tasks";

  let newTask = $state('');
  let tasks = $state<Task[]>([]);

  $effect(() => {
    fetchTasks().then((data) => {
      if (data) {
        tasks = data;
      }
    });
  });
</script>

<div class="absolute inline-block m-2 p-4 bottom-5 right-5 rounded-lg bg-slate-950/80">
  <h3 class="text-lg text-white">Tasks</h3>
  <ul class="task-list">
    {#each tasks as task}
      <li class="py-1 m-1 text-sm text-white">
        <input class="translate-y-0.5" type="checkbox" disabled checked={task.status !== 'needsAction'} />
        {task.title}
      </li>
    {/each}
    <input bind:value={newTask} onkeypress={
      (e) => {
        if (e.key === 'Enter' && newTask) {
          tasks = [...tasks, { id: Math.ceil(Math.random() * 100000).toString(), title: newTask, status: 'needsAction' }];
          newTask = '';
        }
      }
    } class="mt-1 border-none outline-none text-sm bg-transparent text-white" type="text" placeholder="New task" />
  </ul>
</div>
