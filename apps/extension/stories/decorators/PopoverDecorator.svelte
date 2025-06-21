<script lang="ts">
  import Button from "@/components/atoms/Button.svelte"
  import { Popover } from "bits-ui"
  import type { Snippet } from "svelte"

  let { children }: { children: Snippet } = $props();
</script>

<Popover.Root>
  <Popover.Trigger>
    <Button>Open Panel Trigger</Button>
  </Popover.Trigger>
  <Popover.Portal>
    {@render children()}
  </Popover.Portal>
</Popover.Root>