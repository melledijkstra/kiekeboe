<script lang="ts">
  import Panel from '@/components/atoms/Panel.svelte'
  import IconButton from '@/components/atoms/IconButton.svelte'
  import { habits } from '@/stores/habits.svelte'
  import { mdiInfinity } from '@mdi/js'
  import { onMount } from 'svelte'

  let newHabit = $state('')
  let open = $state(false)

  onMount(() => {
    habits.initialize()
  })

  async function handleAddHabit() {
    if (newHabit.trim()) {
      await habits.add({
        name: newHabit,
        color: '#eee',
        dateCreated: new Date()
      })
      newHabit = ''
    }
  }
</script>

<div class="relative">
  <IconButton
    onclick={() => (open = !open)}
    icon={mdiInfinity}
  />
  <Panel class={[open ? 'block' : 'hidden', 'absolute right-0 p-4 min-w-80']}>
    <h1 class="text-xl font-bold">Habit Tracker</h1>
    <div class="mt-4">
      <input
        type="text"
        bind:value={newHabit}
        placeholder="Enter new habit"
        class="border text-black p-2 rounded-sm w-full"
      />
      <button
        onclick={handleAddHabit}
        class="mt-2 bg-blue-500 text-white p-2 rounded-sm">Add Habit</button
      >
    </div>
    <ul class="mt-4">
      {#each $habits as habit, i (i)}
        <li style:color={habit.color} class="p-2 border-b">{habit.name}</li>
      {/each}
    </ul>
  </Panel>
</div>
