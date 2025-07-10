<script>
  import TextButton from "@/components/TextButton.svelte"
  import { Popover } from "bits-ui"
  import { onMount } from "svelte"
  import { notes } from '@/stores/notes.svelte'
  import NotesPanel from "./NotesPanel.svelte"

  onMount(async () => {
    notes.initialize()
  })
</script>

<Popover.Root>
  <Popover.Trigger>
    <TextButton>Notes</TextButton>
  </Popover.Trigger>
  <NotesPanel />
</Popover.Root>
