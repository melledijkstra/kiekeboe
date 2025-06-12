<script lang="ts">
  import { mdiWebClock } from '@mdi/js'
  import { clickOutside } from '@/actions/click-outside'
  import IconButton from '@/components/atoms/IconButton.svelte'
  import Form from './Form.svelte'

  let open: boolean = $state(false)

  function toggleDisplay() {
    if (open) {
      open = false
    } else {
      open = true
    }
  }
</script>

<div class="relative" use:clickOutside={() => (open = false)}>
  <IconButton
    tooltip={!open ? 'Clocks' : ''}
    onclick={toggleDisplay}
    icon={mdiWebClock}
  />
  {#if open}
    <Form />
  {/if}
</div>
