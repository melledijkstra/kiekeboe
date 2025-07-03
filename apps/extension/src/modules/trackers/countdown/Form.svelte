<script lang="ts">
  import Icon from '@/components/atoms/Icon.svelte'
  import Toggle from '@/components/atoms/Toggle.svelte'
  import { trackers } from '../state.svelte'
  import { mdiCalendarPlusOutline } from '@mdi/js'
  import Input from '@/components/atoms/Input.svelte'

  const { onSubmitted }: { onSubmitted?: () => void } = $props()

  let inputName = $state('')
  let inputDate = $state(getToday())
  let inputPinned = $state(false)

  function getToday(): string {
    return new Date().toISOString()?.split('T')[0]
  }

  function resetForm() {
    inputName = ''
    inputDate = getToday()
    inputPinned = false
  }
</script>

<form
  class="mt-5 flex flex-col gap-1 text-white text-left"
  onsubmit={(e) => {
    e.preventDefault()
    trackers.addCountdown(inputName, inputDate, inputPinned)
    onSubmitted?.()
    resetForm()
  }}
>
  <Input
    id="countdown-date"
    label="Date"
    type="date"
    required
    bind:value={inputDate}
  />
  <Input
    label="Name"
    class="mb-2"
    placeholder="Countdown Name"
    required
    type="text"
    bind:value={inputName}
  />
  <Toggle bind:checked={inputPinned} label="Pin?" />
  <button
    class="flex items-center justify-center gap-1 mt-2 py-2 px-3 bg-slate-800 hover:bg-slate-500 rounded-sm cursor-pointer"
    type="submit"
  >
    <Icon size={16} path={mdiCalendarPlusOutline} /> Add Countdown
  </button>
</form>