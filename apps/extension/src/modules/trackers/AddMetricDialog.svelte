<script lang="ts">
  import Panel from '@/components/Panel.svelte'
  import Icon from '@/components/Icon.svelte'
  import IconButton from '@/components/IconButton.svelte'
  import { mdiPlus, mdiPlusCircle } from '@mdi/js'
  import CountdownForm from './countdown/Form.svelte'
  import WorldClockForm from './world-clocks/Form.svelte'
  import Button from '@/components/Button.svelte'
  import { clickOutside } from '@/actions/click-outside'

  type FormType = 'countdown' | 'worldclock' | 'sleep'

  let addTrackerDialogOpen = $state(false)

  let currentForm = $state<FormType>();

  function showForm(formType: FormType) {
    currentForm = formType
  }

  function addSleepTracker() {
    alert('not yet implemented')
  }
</script>

<div class="relative" use:clickOutside={() => (addTrackerDialogOpen = false)}>
  <IconButton
    icon={mdiPlus}
    class={[
      addTrackerDialogOpen ? 'opacity-100' : 'opacity-0',
      'group-hover:opacity-100 transition-opacity duration-300 p-1 flex-col cursor-pointer'
    ]}
    onclick={() => (addTrackerDialogOpen = !addTrackerDialogOpen)}
  >
    <span>Add</span>
  </IconButton>
  {#if !currentForm}
    <Panel
      class={[
        addTrackerDialogOpen ? 'block' : 'hidden',
        'absolute right-0 text-center w-sm'
      ]}
    >
      <p class="text-lg mb-4 font-bold">Add tracker</p>
      <div class="flex flex-row justify-between gap-4 items-stretch">
        <button onclick={() => showForm('countdown')}>
          <Icon path={mdiPlusCircle} />
          Countdown
        </button>
        <button onclick={() => showForm('worldclock')}>
          <Icon path={mdiPlusCircle} />
          World Clock
        </button>
        <button onclick={() => showForm('sleep')}>
          <Icon path={mdiPlusCircle} />
          Sleep Tracker
        </button>
      </div>
    </Panel>
  {:else if currentForm === 'countdown'}
    <CountdownForm />
  {:else if currentForm === 'worldclock'}
    <WorldClockForm />
  {:else if currentForm === 'sleep'}
    <Panel class="absolute right-0">
      <Button onclick={addSleepTracker}>Add sleep tracker</Button>
    </Panel>
  {/if}
</div>
