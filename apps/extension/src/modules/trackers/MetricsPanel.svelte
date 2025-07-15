<script lang="ts">
  import Icon from '@/components/atoms/Icon.svelte'
  import { mdiArrowLeft, mdiDelete, mdiPin, mdiPinOff, mdiPlusCircle, mdiPlus } from '@mdi/js'
  import CountdownForm from './countdown/Form.svelte'
  import WorldClockForm from './world-clocks/Form.svelte'
  import Button from '@/components/atoms/Button.svelte'
  import Countdown from '@/components/atoms/metrics/Countdown.svelte'
  import { setIsSleepMetricEnabled, trackers } from './state.svelte'
  import WorldClock from '@/components/atoms/metrics/WorldClock.svelte'
  import { Popover } from 'bits-ui'
  import PopPanel from '@/components/atoms/PopPanel.svelte'

  type FormType = 'countdown' | 'worldclock' | 'sleep' | 'counter';

  let isOpen = $state(false)

  let currentForm = $state<FormType>();

  function showForm(formType: FormType) {
    currentForm = formType
  }

  function backToMain() {
    currentForm = undefined
  }

  function addSleepTracker() {
    setIsSleepMetricEnabled(true);
  }
</script>

<Popover.Root bind:open={isOpen}>
  <Popover.Trigger
    class={[
      isOpen ? 'opacity-100' : 'opacity-0',
      'group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 flex flex-col cursor-pointer',
      'text-center dark:text-white/70 dark:hover:text-white text-zinc-500 hover:text-zinc-700',
      'cursor-pointer transition-colors',
    ]}
  >
    <Icon path={mdiPlus} size={24} class="mx-auto" />
    <span class="text-xs">Add</span>
  </Popover.Trigger>
  <PopPanel>
    {#if currentForm}
      <button class="float-left" onclick={() => (currentForm = undefined)}>
        <Icon path={mdiArrowLeft} size={20} />
      </button>
    {/if}
    {#if !currentForm}
      <p class="text-lg text-center mb-4 font-bold">Add Metric</p>
      <div class="flex flex-row justify-between gap-4 items-stretch">
        <button onclick={() => showForm('countdown')}>
          <Icon path={mdiPlusCircle} />
          Countdown
        </button>
        <button onclick={() => showForm('worldclock')}>
          <Icon path={mdiPlusCircle} />
          World Clock
        </button>
        <button onclick={() => showForm('counter')}>
          <Icon path={mdiPlusCircle} />
          Counter
        </button>
        <button onclick={() => showForm('sleep')}>
          <Icon path={mdiPlusCircle} />
          Sleep Metrics
        </button>
      </div>
      <hr class="my-2" />
      <!-- list of saved metrics -->
      {#each trackers.countdowns as countdown, i (i)}
        <div class="flex flex-row justify-between gap-2">
          <Countdown metric={countdown} />
          <button onclick={() => trackers.deleteCountdown(i)} class="cursor-pointer">
            <Icon path={mdiDelete} size={20} />
          </button>
        </div>
      {/each}
      {#each trackers.worldClocks as worldClock, i (i)}
        <div class="flex flex-row justify-between gap-2">
          <WorldClock metric={worldClock} />
          <button onclick={() => trackers.deleteWorldClock(i)} class="cursor-pointer">
            <Icon path={mdiDelete} size={20} />
          </button>
          <button onclick={() => trackers.pinWorldClock(i, !worldClock.pinned)} class="cursor-pointer">
            <Icon path={worldClock.pinned ? mdiPin : mdiPinOff} size={20} />
          </button>
        </div>
      {/each}
    {:else if currentForm === 'countdown'}
      <h2 class="text-lg mb-3">Countdowns 🗓️</h2>
      <CountdownForm onSubmitted={backToMain} />
    {:else if currentForm === 'worldclock'}
      <h2 class="text-lg mb-3">World Clocks 🌎</h2>
      <WorldClockForm onSubmitted={backToMain} />
    {:else if currentForm === 'counter'}
      <h2 class="text-lg mb-3">Counters 🔢</h2>
      <!-- Placeholder for future counter form -->
      <p>Counter form not yet implemented.</p>
    {:else if currentForm === 'sleep'}
      <Button onclick={addSleepTracker}>Add sleep tracker</Button>
    {/if}
  </PopPanel>
</Popover.Root>
