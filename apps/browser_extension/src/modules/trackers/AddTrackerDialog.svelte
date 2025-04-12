<script lang="ts">
  import Card from '@/components/Card.svelte'
  import Icon from '@/components/Icon.svelte'
  import IconButton from '@/components/IconButton.svelte'
  import { mdiPlus, mdiPlusCircle } from '@mdi/js'
  import { trackers } from './state.svelte'

  let addTrackerDialogOpen = $state(false)
</script>

<div class="relative">
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
  <Card
    class={[
      addTrackerDialogOpen ? 'block' : 'hidden',
      'absolute right-0 text-center w-sm'
    ]}
  >
    <p class="text-lg mb-4 font-bold">Add tracker</p>
    <div class="flex flex-row justify-between gap-4 items-stretch">
      <button
        onclick={() =>
          (trackers.worldClocks = [
            ...trackers.worldClocks,
            {
              name: 'Test',
              timeZone: 'Europe/Madrid',
              pinned: true
            }
          ])}
      >
        <Icon path={mdiPlusCircle} />
        Countdown
      </button>
      <button>
        <Icon path={mdiPlusCircle} />
        World Clock
      </button>
      <button>
        <Icon path={mdiPlusCircle} />
        Sleep Tracker
      </button>
    </div>
  </Card>
</div>
