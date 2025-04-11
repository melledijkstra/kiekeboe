<script lang="ts">
  import Pomodoro from './Pomodoro.svelte'
  import CountUp from './CountUp.svelte'
  import TextInput from '@/components/TextInput.svelte'
  import Button from '@/components/Button.svelte'
  import { onDestroy } from 'svelte'
  import { storeFocusSession } from '@/db/focus'

  type TimerMode = 'count-up' | 'pomodoro'

  let mode = $state<TimerMode>('count-up')
  let focusItem = $state('')
  let minutesCompleted = $state(0)

  function onMinutePassed() {
    minutesCompleted++
  }

  onDestroy(() => {
    if (minutesCompleted > 0) {
      storeFocusSession({
        topic: focusItem,
        startDateTime: new Date(),
        endDateTime: new Date(),
        totalDuration: minutesCompleted
      })
    }
  })
</script>

<div class="flex flex-col items-center space-y-4 text-white">
  <h1 class="text-4xl">
    Focus
    {#if focusItem}
      <sup class="text-sm">{focusItem}</sup>
    {/if}
  </h1>
  <p class="text-xl">Minutes completed: {minutesCompleted}</p>
  <div class="flex space-x-4">
    <Button
      class={[
        mode === 'count-up' && 'opacity-50',
        'bg-black/50 p-2 rounded-sm'
      ]}
      onclick={() => (mode = 'count-up')}
    >
      Count Up
    </Button>
    <Button
      class={[
        mode === 'pomodoro' && 'opacity-50',
        'bg-black/50 p-2 rounded-sm'
      ]}
      onclick={() => (mode = 'pomodoro')}
    >
      Pomodoro
    </Button>
  </div>
  {#if mode === 'pomodoro'}
    <Pomodoro {onMinutePassed} />
  {:else}
    <CountUp {onMinutePassed} />
  {/if}

  <label for="focusItem">What are you focussing on?</label>
  <TextInput id="focusItem" class="bg-black/50 text-white" bind:value={focusItem} />
</div>
