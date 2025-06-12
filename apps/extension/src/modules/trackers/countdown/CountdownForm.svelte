<script lang="ts">
  import {
    mdiCalendarOutline
  } from '@mdi/js'
  import { clickOutside } from '@/actions/click-outside'
  import IconButton from '@/components/atoms/IconButton.svelte'
  import Form from './Form.svelte'

  const props = $props()

  let open: boolean = $state(false)

  function toggleDisplay() {
    open = !open
  }
</script>

<div class="relative {props.class}" use:clickOutside={() => (open = false)}>
  <IconButton
    tooltip={!open ? 'Countdown' : ''}
    onclick={toggleDisplay}
    icon={mdiCalendarOutline}
  />
  {#if open}
    <Form />
  {/if}
</div>
