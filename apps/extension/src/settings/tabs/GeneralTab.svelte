<script>
  import Toggle from "@/components/atoms/Toggle.svelte"
  import { settingsStore, saveSettingsToStorage } from "@/settings"

  const { settingsLoaded } = $props()
</script>

<h1 class="text-xl">General Settings</h1>
<Toggle
  disabled={!settingsLoaded}
  label="Show currently focussed task (required Google Tasks)"
  parentClass="my-2"
  onchange={() => saveSettingsToStorage($settingsStore)}
  bind:checked={$settingsStore.ui.showCurrentTask}
/>