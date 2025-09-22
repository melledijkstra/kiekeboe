<script lang="ts">
  import Icon from '@/components/atoms/Icon.svelte'
  import Toggle from '@/components/atoms/Toggle.svelte'
  import { mdiClockPlusOutline } from '@mdi/js'
  import { trackers } from '../state.svelte'
  import Input from '@/components/atoms/Input.svelte'
  import Select from '@/components/atoms/Select.svelte'

  const { onSubmitted }: { onSubmitted?: () => void } = $props()

  let inputTimezone: string = $state('')
  let inputName: string = $state('')
  let inputPinned: boolean = $state(false)

  function resetForm() {
    inputName = ''
    inputTimezone = ''
    inputPinned = false
  }
</script>

<form
  class="flex flex-col gap-1"
  onsubmit={(e) => {
    e.preventDefault()
    trackers.addWorldClock(inputName, inputTimezone, inputPinned)
    onSubmitted?.()
    resetForm()
  }}
>
  <Select
    id="timezone-select"
    required
    bind:value={inputTimezone}
    options={Intl.supportedValuesOf('timeZone').map((tz) => ({
      value: tz,
      label: tz.replace(/_/g, ' ')
    }))}
    placeholder="Select timezone"
    label="Timezone" />
  <Input
    id="world-clock-name"
    label="Name"
    class="mb-2"
    placeholder="World Clock Name"
    required
    type="text"
    bind:value={inputName}
  />
  <Toggle bind:checked={inputPinned} label="Pin?" />
  <button
    class="flex items-center justify-center gap-1 mt-2 py-2 px-3 bg-slate-800 hover:bg-slate-500 rounded-sm cursor-pointer"
    type="submit"
  >
    <Icon size={16} path={mdiClockPlusOutline} /> Add Clock
  </button>
</form>
