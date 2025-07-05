<script>
  import Toggle from "@/components/atoms/Toggle.svelte"
  import { settings, settingsStore } from "@/settings/index.svelte"
</script>

<h1 class="text-xl">General Settings</h1>
<Toggle
  label="Show currently focussed task (required Google Tasks)"
  parentClass="my-2"
  onchange={() => settings.saveSettingsToStorage()}
  bind:checked={$settingsStore.ui.showCurrentTask}
/>